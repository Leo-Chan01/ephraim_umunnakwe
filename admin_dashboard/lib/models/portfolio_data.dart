class Project {
  int? id;
  String name;
  String description;
  String status;
  DateTime? startDate;
  DateTime? endDate;
  String priority;
  List<String> technologies;
  String role;
  String? previewImage;
  String? projectUrl;
  String? githubUrl;

  Project({
    this.id,
    required this.name,
    required this.description,
    required this.status,
    this.startDate,
    this.endDate,
    required this.priority,
    required this.technologies,
    required this.role,
    this.previewImage,
    this.projectUrl,
    this.githubUrl,
  });

  factory Project.fromJson(Map<String, dynamic> json) => Project(
        id: json['id'],
        name: json['name'] ?? '',
        description: json['description'] ?? '',
        status: json['status'] ?? 'Planning',
        startDate: json['startDate'] != null
            ? DateTime.tryParse(json['startDate'])
            : null,
        endDate:
            json['endDate'] != null ? DateTime.tryParse(json['endDate']) : null,
        priority: json['priority'] ?? 'Medium',
        technologies: List<String>.from(json['technologies'] ?? []),
        role: json['role'] ?? '',
        previewImage: json['preview_image'],
        projectUrl: json['project_url'],
        githubUrl: json['github_url'],
      );

  Map<String, dynamic> toJson() => {
        if (id != null) 'id': id,
        'name': name,
        'description': description,
        'status': status,
        'startDate': startDate?.toIso8601String(),
        'endDate': endDate?.toIso8601String(),
        'priority': priority,
        'technologies': technologies,
        'role': role,
        if (previewImage != null) 'preview_image': previewImage,
        if (projectUrl != null) 'project_url': projectUrl,
        if (githubUrl != null) 'github_url': githubUrl,
        'updated_at': DateTime.now().toIso8601String(),
      };

  Project copyWith({
    int? id,
    String? name,
    String? description,
    String? status,
    DateTime? startDate,
    DateTime? endDate,
    String? priority,
    List<String>? technologies,
    String? role,
    String? previewImage,
    String? projectUrl,
    String? githubUrl,
  }) =>
      Project(
        id: id ?? this.id,
        name: name ?? this.name,
        description: description ?? this.description,
        status: status ?? this.status,
        startDate: startDate ?? this.startDate,
        endDate: endDate ?? this.endDate,
        priority: priority ?? this.priority,
        technologies: technologies ?? this.technologies,
        role: role ?? this.role,
        previewImage: previewImage ?? this.previewImage,
        projectUrl: projectUrl ?? this.projectUrl,
        githubUrl: githubUrl ?? this.githubUrl,
      );
}

class Testimonial {
  int? id;
  String author;
  String role;
  String message;
  double rating;
  String? avatarUrl;
  DateTime createdAt;

  Testimonial({
    this.id,
    required this.author,
    required this.role,
    required this.message,
    required this.rating,
    this.avatarUrl,
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  factory Testimonial.fromJson(Map<String, dynamic> json) => Testimonial(
        id: json['id'],
        author: json['author'] ?? '',
        role: json['role'] ?? '',
        message: json['message'] ?? '',
        rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
        avatarUrl: json['avatarUrl'] ?? '',
        createdAt:
            DateTime.tryParse(json['created_at'] ?? '') ?? DateTime.now(),
      );

  Map<String, dynamic> toJson() => {
        if (id != null) 'id': id,
        'author': author,
        'role': role,
        'message': message,
        'rating': rating,
        if (avatarUrl != null) 'avatarUrl': avatarUrl,
      };

  Testimonial copyWith({
    int? id,
    String? author,
    String? role,
    String? message,
    double? rating,
    String? avatarUrl,
    DateTime? createdAt,
  }) =>
      Testimonial(
        id: id ?? this.id,
        author: author ?? this.author,
        role: role ?? this.role,
        message: message ?? this.message,
        rating: rating ?? this.rating,
        avatarUrl: avatarUrl ?? this.avatarUrl,
        createdAt: createdAt ?? this.createdAt,
      );
}

class SocialLink {
  String platform;
  String url;
  bool isVisible;

  SocialLink({
    required this.platform,
    required this.url,
    this.isVisible = true,
  });

  factory SocialLink.fromJson(Map<String, dynamic> json) => SocialLink(
        platform: json['platform'] ?? '',
        url: json['url'] ?? '',
        isVisible: json['is_visible'] ?? true,
      );

  Map<String, dynamic> toJson() => {
        'platform': platform,
        'url': url,
        'is_visible': isVisible,
      };

  SocialLink copyWith({
    String? platform,
    String? url,
    bool? isVisible,
  }) =>
      SocialLink(
        platform: platform ?? this.platform,
        url: url ?? this.url,
        isVisible: isVisible ?? this.isVisible,
      );
}

class PersonalInfo {
  String name;
  String title;
  String email;
  String phone;
  String location;
  String bio;
  String? profileImageUrl;

  PersonalInfo({
    required this.name,
    required this.title,
    required this.email,
    required this.phone,
    required this.location,
    required this.bio,
    this.profileImageUrl,
  });

  factory PersonalInfo.fromJson(Map<String, dynamic> json) => PersonalInfo(
        name: json['name'] ?? '',
        title: json['title'] ?? '',
        email: json['email'] ?? '',
        phone: json['phone'] ?? '',
        location: json['location'] ?? '',
        bio: json['bio'] ?? '',
        // profileImageUrl: json['profileImageUrl'],
      );

  Map<String, dynamic> toJson() => {
        'name': name,
        'title': title,
        'email': email,
        'phone': phone,
        'location': location,
        'bio': bio,
        if (profileImageUrl != null) 'profileImageUrl': profileImageUrl,
      };

  PersonalInfo copyWith({
    String? name,
    String? title,
    String? email,
    String? phone,
    String? location,
    String? bio,
    String? profileImageUrl,
  }) =>
      PersonalInfo(
        name: name ?? this.name,
        title: title ?? this.title,
        email: email ?? this.email,
        phone: phone ?? this.phone,
        location: location ?? this.location,
        bio: bio ?? this.bio,
        profileImageUrl: profileImageUrl ?? this.profileImageUrl,
      );
}
