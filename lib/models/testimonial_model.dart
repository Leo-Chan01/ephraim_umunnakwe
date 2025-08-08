class Testimonial {
  int id;
  String author;
  String role;
  String message;
  double rating;
  String? avatarUrl;
  DateTime createdAt;

  Testimonial({
    required this.id,
    required this.author,
    required this.role,
    required this.message,
    required this.rating,
    this.avatarUrl,
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  factory Testimonial.fromJson(Map<String, dynamic> json) => Testimonial(
        id: json['id'],
        author: json['author'],
        role: json['role'],
        message: json['message'],
        rating: (json['rating'] as num).toDouble(),
        avatarUrl: json['avatarUrl'],
        createdAt: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'author': author,
        'role': role,
        'message': message,
        'rating': rating,
        'avatarUrl': avatarUrl,
        'createdAt': createdAt.toIso8601String(),
      };
}
