class Project {
  int? id;
  String? name;
  String? description;
  String? status;
  DateTime? startDate;
  DateTime? endDate;
  String? priority;
  List<String>? technologies;
  String? role;

  Project({
    this.id,
    this.name,
    this.description,
    this.status,
    this.startDate,
    this.endDate,
    this.priority,
    this.technologies,
    this.role,
  });

  factory Project.fromJson(Map<String, dynamic> json) {
    return Project(
      id: json['id'],
      name: json['name'],
      description: json['description'],
      status: json['status'],
      startDate: DateTime.parse(json['startDate']),
      endDate: DateTime.parse(json['endDate']),
      priority: json['priority'],
      technologies: List<String>.from(json['technologies']),
      role: json['role'],
    );
  }
}
