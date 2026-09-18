namespace UniPilot.Api.Domain;

public sealed record Course(string Code,string Name,int Credits,IReadOnlyList<string> Prerequisites,IReadOnlyList<string> Tags,int SuggestedSemester);
public sealed record StudentProfile(string Id,string FullName,string Major,int Cohort,IReadOnlySet<string> CompletedCourses,double Gpa,int EarnedCredits,int RequiredCredits);
public sealed record EligibleCourse(Course Course,bool Eligible,IReadOnlyList<string> MissingPrerequisites,int CareerScore);
public sealed record PlanItem(string Code,string Name,int Credits,string Reason);
public sealed record SemesterPlan(string StudentId,string CareerGoal,int MaxCredits,int PlannedCredits,IReadOnlyList<PlanItem> Courses,string AdvisorMessage);
public sealed record PlanRequest(string? CareerGoal,int? MaxCredits);
