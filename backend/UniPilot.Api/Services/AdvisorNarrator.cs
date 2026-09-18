using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using UniPilot.Api.Domain;
namespace UniPilot.Api.Services;
public interface IAdvisorNarrator { Task<string> ExplainAsync(StudentProfile student,string careerGoal,IReadOnlyList<Course> courses,CancellationToken ct); }
public sealed class AdvisorNarrator(HttpClient http,IConfiguration config):IAdvisorNarrator{
 public async Task<string> ExplainAsync(StudentProfile student,string careerGoal,IReadOnlyList<Course> courses,CancellationToken ct){
  var key=config["AI_API_KEY"]; var baseUrl=config["AI_BASE_URL"]??"https://api.openai.com/v1"; var model=config["AI_MODEL"]??"gpt-4o-mini";
  if(string.IsNullOrWhiteSpace(key)) return Fallback(student,careerGoal,courses);
  var compact=string.Join(", ",courses.Select(c=>$"{c.Code} {c.Name} ({c.Credits} tín chỉ)"));
  var prompt=$"Bạn là trợ lý cố vấn học tập. Chỉ giải thích kế hoạch đã được rule engine xác minh; không thêm môn mới. Sinh viên: {student.FullName}; ngành: {student.Major}; GPA: {student.Gpa:0.00}; mục tiêu: {careerGoal}. Các môn đã được hệ thống chọn: {compact}. Viết 3-5 câu tiếng Việt, ngắn gọn, nêu lý do và nhắc sinh viên xác nhận với cố vấn học tập.";
  using var req=new HttpRequestMessage(HttpMethod.Post,$"{baseUrl.TrimEnd('/')}/chat/completions"); req.Headers.Authorization=new AuthenticationHeaderValue("Bearer",key);
  req.Content=new StringContent(JsonSerializer.Serialize(new{model,messages=new[]{new{role="user",content=prompt}},temperature=0.2}),Encoding.UTF8,"application/json");
  try{ using var resp=await http.SendAsync(req,ct); if(!resp.IsSuccessStatusCode) return Fallback(student,careerGoal,courses); using var json=JsonDocument.Parse(await resp.Content.ReadAsStringAsync(ct)); return json.RootElement.GetProperty("choices")[0].GetProperty("message").GetProperty("content").GetString() ?? Fallback(student,careerGoal,courses);}catch{return Fallback(student,careerGoal,courses);} }
 static string Fallback(StudentProfile s,string goal,IReadOnlyList<Course> courses)=>courses.Count==0?"Hiện chưa có môn phù hợp trong giới hạn tín chỉ đã chọn.":$"Với mục tiêu {goal}, hệ thống ưu tiên {string.Join(", ",courses.Select(c=>c.Name))}. Các môn này đã vượt qua kiểm tra điều kiện tiên quyết bằng rule engine. GPA hiện tại của bạn là {s.Gpa:0.00}; hãy xác nhận kế hoạch với cố vấn học tập trước khi đăng ký chính thức.";
}
