using UniPilot.Api.Domain;
namespace UniPilot.Api.Services;
public sealed class AcademicRuleEngine(IReadOnlyList<Course> courses){
 public IReadOnlyList<EligibleCourse> Evaluate(StudentProfile student,string careerGoal){
  var terms=careerGoal.ToLowerInvariant().Replace("."," ").Replace("-"," ").Split(' ',StringSplitOptions.RemoveEmptyEntries|StringSplitOptions.TrimEntries);
  return courses.Where(c=>!student.CompletedCourses.Contains(c.Code)).Select(c=>{
   var missing=c.Prerequisites.Where(p=>!student.CompletedCourses.Contains(p)).ToArray();
   var score=c.Tags.Count(tag=>terms.Any(t=>tag.Contains(t,StringComparison.OrdinalIgnoreCase)||t.Contains(tag,StringComparison.OrdinalIgnoreCase)));
   return new EligibleCourse(c,missing.Length==0,missing,score);
  }).OrderByDescending(x=>x.Eligible).ThenByDescending(x=>x.CareerScore).ThenBy(x=>x.Course.SuggestedSemester).ToArray();
 }
 public IReadOnlyList<Course> BuildPlan(StudentProfile student,string goal,int maxCredits){
  var used=0; var result=new List<Course>();
  foreach(var c in Evaluate(student,goal).Where(x=>x.Eligible).OrderByDescending(x=>x.CareerScore).ThenBy(x=>x.Course.SuggestedSemester).Select(x=>x.Course)){
   if(used+c.Credits>maxCredits) continue; result.Add(c); used+=c.Credits;
  }
  return result;
 }
}
