using UniPilot.Api.Domain;
namespace UniPilot.Api.Services;
public sealed class AcademicAdvisorService(AcademicRuleEngine rules,IAdvisorNarrator narrator){
 public IReadOnlyList<EligibleCourse> GetEligibility(StudentProfile student,string goal)=>rules.Evaluate(student,goal);
 public async Task<SemesterPlan> BuildPlanAsync(StudentProfile student,string goal,int maxCredits,CancellationToken ct){
  maxCredits=Math.Clamp(maxCredits,3,24); var courses=rules.BuildPlan(student,goal,maxCredits); var msg=await narrator.ExplainAsync(student,goal,courses,ct);
  return new SemesterPlan(student.Id,goal,maxCredits,courses.Sum(c=>c.Credits),courses.Select(c=>new PlanItem(c.Code,c.Name,c.Credits,c.Tags.Any(t=>goal.Contains(t,StringComparison.OrdinalIgnoreCase))?"Phù hợp trực tiếp với mục tiêu nghề nghiệp.":"Phù hợp với lộ trình và điều kiện tiên quyết hiện tại.")).ToArray(),msg);
 }
}
