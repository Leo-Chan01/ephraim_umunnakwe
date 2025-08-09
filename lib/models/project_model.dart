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
      startDate:
          json['startDate'] != null ? DateTime.parse(json['startDate']) : null,
      endDate: json['endDate'] != null ? DateTime.parse(json['endDate']) : null,
      priority: json['priority'],
      technologies: json['technologies'] != null
          ? List<String>.from(json['technologies'])
          : null,
      role: json['role'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'status': status,
      'startDate': startDate?.toIso8601String(),
      'endDate': endDate?.toIso8601String(),
      'priority': priority,
      'technologies': technologies,
      'role': role,
    };
  }
}
