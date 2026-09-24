import {
  StudentProfile,
  Opportunity,
  RecommendationResult,
  SkillProficiencyLevel,
  LearningProgram
} from '../types/shared';
import { db } from '../db/store';

const LEVEL_WEIGHTS: Record<SkillProficiencyLevel, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3
};

export class RecommendationEngine {
  /**
   * Calculates skill compatibility score and evaluates eligibility criteria.
   * Returns a transparent, explainable breakdown.
   */
  public static evaluateOpportunity(
    student: StudentProfile,
    opportunity: Opportunity
  ): RecommendationResult {
    const requiredSkills = opportunity.requiredSkills || [];
    let totalWeight = 0;
    let earnedWeight = 0;
    const matchingSkills: string[] = [];
    const missingSkills: string[] = [];

    // 1. Skill Compatibility Evaluation
    for (const req of requiredSkills) {
      const weight = req.weight || 1;
      totalWeight += weight;

      // Find matching skill in student profile (case-insensitive substring match)
      const studentSkill = student.skills.find(
        (s) =>
          s.skill.toLowerCase().includes(req.skill.toLowerCase()) ||
          req.skill.toLowerCase().includes(s.skill.toLowerCase())
      );

      if (studentSkill) {
        matchingSkills.push(req.skill);
        const reqVal = LEVEL_WEIGHTS[req.requiredLevel] || 1;
        const stuVal = LEVEL_WEIGHTS[studentSkill.level] || 1;

        // If student level is >= required level, full weight; otherwise proportional
        const levelFactor = Math.min(1, stuVal / reqVal);
        // Verified skills get an extra 10% trust bonus up to max 1.0
        const trustMultiplier = studentSkill.verified ? 1.0 : 0.95;

        earnedWeight += weight * levelFactor * trustMultiplier;
      } else {
        missingSkills.push(req.skill);
      }
    }

    // Compatibility score from 0 to 100
    const compatibilityScore =
      totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 75;

    // 2. Eligibility Checks
    const eligibilityIssues: string[] = [];
    if (opportunity.eligibility) {
      const { minCgpa, allowedBranches, allowedGradYears } = opportunity.eligibility;

      if (minCgpa && student.cgpa < minCgpa) {
        eligibilityIssues.push(`Minimum CGPA required is ${minCgpa}, student CGPA is ${student.cgpa}`);
      }

      if (
        allowedBranches &&
        allowedBranches.length > 0 &&
        !allowedBranches.some(
          (b) =>
            b.toLowerCase().includes(student.branch.toLowerCase()) ||
            student.branch.toLowerCase().includes(b.toLowerCase())
        )
      ) {
        eligibilityIssues.push(
          `Designated branches are: ${allowedBranches.join(', ')} (Candidate branch: ${student.branch})`
        );
      }

      if (
        allowedGradYears &&
        allowedGradYears.length > 0 &&
        !allowedGradYears.includes(student.graduationYear)
      ) {
        eligibilityIssues.push(
          `Target graduation years: ${allowedGradYears.join(', ')} (Candidate: ${student.graduationYear})`
        );
      }
    }

    const isEligible = eligibilityIssues.length === 0;

    // Match score blends compatibility and bonus for career interest alignment
    let interestBonus = 0;
    if (
      student.careerInterests &&
      student.careerInterests.some(
        (interest) =>
          opportunity.title.toLowerCase().includes(interest.toLowerCase()) ||
          opportunity.description.toLowerCase().includes(interest.toLowerCase())
      )
    ) {
      interestBonus = 5;
    }

    const matchScore = Math.min(100, Math.round(compatibilityScore + interestBonus));

    // 3. Recommended Courses to Bridge Identified Skill Gaps
    const allLearningPrograms = db.get('learningPrograms');
    const recommendedCourses: RecommendationResult['recommendedCourses'] = [];

    for (const missing of missingSkills) {
      const matchedProgram = allLearningPrograms.find((prog: LearningProgram) =>
        prog.skillsCovered.some((sk) =>
          sk.toLowerCase().includes(missing.toLowerCase()) ||
          missing.toLowerCase().includes(sk.toLowerCase())
        )
      );

      if (matchedProgram && !recommendedCourses.some((c) => c.title === matchedProgram.title)) {
        recommendedCourses.push({
          title: matchedProgram.title,
          provider: matchedProgram.provider,
          skillsCovered: matchedProgram.skillsCovered,
          duration: matchedProgram.duration,
          url: `/learning?search=${encodeURIComponent(missing)}`
        });
      }
    }

    // 4. Clear Transparent Explanation
    let matchExplanation = '';
    if (matchScore >= 85) {
      matchExplanation = `High match (${matchScore}%). You possess strong verified alignment in key competencies (${matchingSkills.join(
        ', '
      )}).`;
    } else if (matchScore >= 65) {
      matchExplanation = `Moderate match (${matchScore}%). You meet core requirements in ${matchingSkills.join(
        ', '
      )}, but bridging gap in [${missingSkills.join(', ')}] will significantly improve your selection chances.`;
    } else {
      matchExplanation = `Foundational match (${matchScore}%). Opportunity requires additional skill depth in [${missingSkills.join(
        ', '
      )}]. Recommended bridging courses are attached below.`;
    }

    if (!isEligible) {
      matchExplanation += ` Note: Eligibility flags detected (${eligibilityIssues.length}).`;
    }

    return {
      opportunity,
      matchScore,
      compatibilityScore,
      matchingSkills,
      missingSkills,
      isEligible,
      eligibilityIssues,
      recommendedCourses,
      matchExplanation
    };
  }

  /**
   * Generates ranked recommendations for a student across all active opportunities.
   */
  public static getRecommendationsForStudent(
    studentId: string,
    filterType?: string
  ): RecommendationResult[] {
    const studentProfiles = db.get('studentProfiles');
    const student = studentProfiles.find((s) => s.userId === studentId || s.id === studentId);

    if (!student) {
      return [];
    }

    let opportunities = db.get('opportunities').filter((o) => o.status === 'active');

    if (filterType && filterType !== 'all') {
      opportunities = opportunities.filter((o) => o.type === filterType);
    }

    const results = opportunities.map((opp) => this.evaluateOpportunity(student, opp));

    // Sort by match score descending, prioritizing eligible candidates
    return results.sort((a, b) => {
      if (a.isEligible !== b.isEligible) {
        return a.isEligible ? -1 : 1;
      }
      return b.matchScore - a.matchScore;
    });
  }
}
