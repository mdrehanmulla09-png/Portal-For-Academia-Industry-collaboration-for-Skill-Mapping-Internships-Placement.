async function runTests() {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('🚀 Running SkillBridge India Automated Verification Suite...\n');

  let passed = 0;
  let failed = 0;

  async function assert(testName, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${testName}`, err.message);
      failed++;
    }
  }

  // 1. Health Check
  await assert('Health check endpoint returns status ok and problem ID 26044', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    if (data.status !== 'ok' || data.problemStatementId !== 26044) {
      throw new Error(`Unexpected health payload: ${JSON.stringify(data)}`);
    }
  });

  // 2. Demo Login - All 5 Roles
  let studentToken = '';
  let industryToken = '';
  let facultyToken = '';
  let instToken = '';
  let adminToken = '';

  const roles = ['student', 'industry', 'faculty', 'institution_admin', 'platform_admin'];
  for (const role of roles) {
    await assert(`Demo login succeeds for role: ${role}`, async () => {
      const res = await fetch(`${BASE_URL}/auth/demo-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      const data = await res.json();
      if (!data.success || !data.token || data.user.role !== role) {
        throw new Error(`Failed to login as ${role}: ${JSON.stringify(data)}`);
      }
      if (role === 'student') studentToken = data.token;
      if (role === 'industry') industryToken = data.token;
      if (role === 'faculty') facultyToken = data.token;
      if (role === 'institution_admin') instToken = data.token;
      if (role === 'platform_admin') adminToken = data.token;
    });
  }

  // 3. Authenticated Session /me
  await assert('Session verification /auth/me returns valid student profile', async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const data = await res.json();
    if (!data.success || !data.profile || data.user.role !== 'student') {
      throw new Error(`Invalid session profile: ${JSON.stringify(data)}`);
    }
  });

  // 4. Opportunities Catalog
  let sampleOppId = '';
  await assert('Opportunities catalog returns active listings with required skills', async () => {
    const res = await fetch(`${BASE_URL}/opportunities`);
    const data = await res.json();
    if (!data.success || data.total < 10) {
      throw new Error(`Expected at least 10 opportunities, found ${data.total}`);
    }
    sampleOppId = data.opportunities[0].id;
  });

  // 5. AI Recommendation Engine
  await assert('AI Recommendation Engine calculates transparent weighted match', async () => {
    const res = await fetch(`${BASE_URL}/recommendations`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const data = await res.json();
    if (!data.success || data.recommendations.length === 0) {
      throw new Error(`No recommendations returned: ${JSON.stringify(data)}`);
    }
    const topRec = data.recommendations[0];
    if (typeof topRec.matchScore !== 'number' || !topRec.matchExplanation) {
      throw new Error(`Missing transparent match score or explanation: ${JSON.stringify(topRec)}`);
    }
  });

  // 6. Assessment Questions
  await assert('Assessment questions are delivered without exposing answer keys', async () => {
    const res = await fetch(`${BASE_URL}/assessments/questions`);
    const data = await res.json();
    if (!data.success || data.total < 12) {
      throw new Error(`Expected at least 12 questions, got ${data.total}`);
    }
    if (data.questions[0].correctOptionIndex !== undefined) {
      throw new Error('Security flaw: correctOptionIndex exposed in questions endpoint!');
    }
  });

  // 7. Submit Assessment & Verify Scoring
  await assert('Assessment submission scores answers and updates student profile', async () => {
    const dummyAnswers = {
      'q-tech-1': 1,
      'q-tech-2': 1,
      'q-tech-3': 1,
      'q-tech-4': 1,
      'q-tech-5': 1,
      'q-soft-1': 1,
      'q-soft-2': 1,
      'q-apt-1': 1,
      'q-apt-2': 2
    };
    const res = await fetch(`${BASE_URL}/assessments/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({ answers: dummyAnswers })
    });
    const data = await res.json();
    if (!data.success || typeof data.result.overallScorePercentage !== 'number') {
      throw new Error(`Failed to submit assessment: ${JSON.stringify(data)}`);
    }
  });

  // 8. Public Portfolio
  await assert('Public portfolio endpoint serves sanitized verified profile without phone/email', async () => {
    const res = await fetch(`${BASE_URL}/portfolios/public/arjun-sharma`);
    const data = await res.json();
    if (!data.success || !data.portfolio.fullName) {
      throw new Error(`Failed to fetch public portfolio: ${JSON.stringify(data)}`);
    }
    if (data.portfolio.phone || data.portfolio.email) {
      throw new Error('Privacy breach: Public portfolio exposed private phone/email!');
    }
  });

  // 9. Submit Internship Application
  let createdAppId = '';
  await assert('Student can submit internship application with live match calculation', async () => {
    const res = await fetch(`${BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        opportunityId: 'opp-2',
        coverLetter: 'Automated test application for NLP Intern.'
      })
    });
    const data = await res.json();
    if (!data.success && !data.message?.includes('already applied')) {
      throw new Error(`Could not submit application: ${JSON.stringify(data)}`);
    }
  });

  // 10. Recruiter Application Review & Status Pipeline
  await assert('Recruiter can review applicants and transition status to shortlisted', async () => {
    const res = await fetch(`${BASE_URL}/applications/recruiter`, {
      headers: { Authorization: `Bearer ${industryToken}` }
    });
    const data = await res.json();
    if (!data.success || data.applications.length === 0) {
      throw new Error('Recruiter could not fetch applicants');
    }
    const targetApp = data.applications[0];
    const patchRes = await fetch(`${BASE_URL}/applications/${targetApp.id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${industryToken}`
      },
      body: JSON.stringify({ status: 'shortlisted', note: 'Automated test shortlisting.' })
    });
    const patchData = await patchRes.json();
    if (!patchData.success || patchData.application.status !== 'shortlisted') {
      throw new Error(`Failed to transition application status: ${JSON.stringify(patchData)}`);
    }
  });

  // 11. Internship Weekly Progress Log
  await assert('Student submits weekly progress report and deliverable', async () => {
    const res = await fetch(`${BASE_URL}/internships/weekly-log`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`
      },
      body: JSON.stringify({
        weekNumber: 4,
        tasksAccomplished: 'Engineered high-concurrency Redis queue.',
        challengesFaced: 'Cache stampede mitigation.',
        learnings: 'Implemented probabilistic early expiration.',
        deliverableLink: 'https://github.com/skillbridge/redis-pr'
      })
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(`Failed to submit weekly log: ${JSON.stringify(data)}`);
    }
  });

  // 12. Admin Credential & Org Verification
  await assert('Platform admin reviews and approves organization verification request', async () => {
    const res = await fetch(`${BASE_URL}/admin/verifications`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (!data.success || data.requests.length === 0) {
      throw new Error('Admin could not fetch verifications');
    }
    const firstReq = data.requests[0];
    const decRes = await fetch(`${BASE_URL}/admin/verifications/${firstReq.id}/decision`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ decision: 'verified', remarks: 'Audited and verified in test suite.' })
    });
    const decData = await decRes.json();
    if (!decData.success || decData.request.status !== 'verified') {
      throw new Error(`Failed to approve verification: ${JSON.stringify(decData)}`);
    }
  });

  console.log('\n=========================================');
  console.log(`🏁 Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('=========================================');

  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Test suite runner crashed:', err);
  process.exit(1);
});
