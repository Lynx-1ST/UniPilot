using UniPilot.Api.Domain;
namespace UniPilot.Api.Data;
public static class SeedData {
 public static IReadOnlyList<Course> Courses { get; } = [
  new("PRG101","Programming Fundamentals",3,[],["programming"],1),
  new("OOP201","Object-Oriented Programming",3,["PRG101"],["programming","backend"],2),
  new("DSA202","Data Structures & Algorithms",3,["PRG101"],["algorithms","backend"],3),
  new("DBS203","Database Systems",3,["PRG101"],["database","backend"],3),
  new("WEB204","Web Development",3,["OOP201"],["web","frontend","backend"],4),
  new("NET301","Computer Networks",3,["DSA202"],["network","cloud"],5),
  new("SWT302","Software Testing",3,["OOP201"],["testing","software-engineering"],5),
  new("SWA303","Software Architecture",3,["OOP201","DBS203"],["architecture","backend","software-engineering"],5),
  new("DEV304","DevOps Fundamentals",3,["WEB204"],["devops","cloud","backend"],6),
  new("CLD305","Cloud Computing",3,["NET301"],["cloud","devops","backend"],6),
  new("DST401","Distributed Systems",3,["NET301","SWA303"],["distributed","backend","cloud"],7),
  new("SEC402","Application Security",3,["WEB204","NET301"],["security","backend"],7),
  new("AI403","Applied Artificial Intelligence",3,["DSA202"],["ai","data"],7),
  new("CAP491","Capstone Project I",6,["SWA303","SWT302"],["capstone","software-engineering"],8),
  new("CAP492","Capstone Project II",6,["CAP491"],["capstone","software-engineering"],9)
 ];
 public static StudentProfile DemoStudent { get; } = new("demo","Nguyễn Minh An","Công nghệ phần mềm",2024,new HashSet<string>(StringComparer.OrdinalIgnoreCase){"PRG101","OOP201","DSA202","DBS203","WEB204"},3.21,78,120);
}
