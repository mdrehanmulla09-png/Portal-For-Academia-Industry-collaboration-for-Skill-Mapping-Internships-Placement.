import { db } from '../db/store';
import { initialDatabase } from '../db/initialData';

export function seedDatabase() {
  console.log('🌱 Seeding SkillBridge India Database...');
  db.resetWith(initialDatabase);
  console.log(`✅ Database Seeded Successfully!`);
  console.log(`- Users: ${initialDatabase.users.length}`);
  console.log(`- Student Profiles: ${initialDatabase.studentProfiles.length}`);
  console.log(`- Industry Profiles: ${initialDatabase.industryProfiles.length}`);
  console.log(`- Opportunities: ${initialDatabase.opportunities.length}`);
  console.log(`- Learning Programs: ${initialDatabase.learningPrograms.length}`);
  console.log(`- Applications: ${initialDatabase.applications.length}`);
  console.log(`- Questions: ${initialDatabase.assessmentQuestions.length}`);
  console.log(`- Verification Requests: ${initialDatabase.verificationRequests.length}`);
}

if (require.main === module) {
  seedDatabase();
}
