import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/project_model.dart';
import '../models/testimonial_model.dart';
import 'supabase_config.dart';

class PortfolioService {
  final SupabaseClient _client = Supabase.instance.client;

  // Fetch projects from Supabase
  Future<List<Project>> getProjects() async {
    try {
      final response = await _client
          .from(SupabaseTables.projects)
          .select()
          .order('created_at', ascending: false);

      return (response as List).map((json) {
        return Project(
          id: json['id'],
          name: json['name'] ?? '',
          description: json['description'] ?? '',
          status: json['status'] ?? '',
          startDate: json['start_date'] != null
              ? DateTime.parse(json['start_date'])
              : DateTime.now(),
          endDate: json['end_date'] != null
              ? DateTime.parse(json['end_date'])
              : null,
          priority: json['priority'] ?? '',
          technologies: List<String>.from(json['technologies'] ?? []),
          role: json['role'] ?? '',
        );
      }).toList();
    } catch (e) {
      print('Error fetching projects: $e');
      return [];
    }
  }

  // Fetch testimonials from Supabase
  Future<List<Testimonial>> getTestimonials() async {
    try {
      final response = await _client
          .from(SupabaseTables.testimonials)
          .select()
          .order('created_at', ascending: false);

      return (response as List).map((json) {
        return Testimonial(
          id: json['id'],
          author: json['author'] ?? '',
          role: json['role'] ?? '',
          message: json['message'] ?? '',
          rating: (json['rating'] ?? 5.0).toDouble(),
          createdAt: json['created_at'] != null
              ? DateTime.parse(json['created_at'])
              : DateTime.now(),
        );
      }).toList();
    } catch (e) {
      print('Error fetching testimonials: $e');
      return [];
    }
  }

  // Fetch social links from Supabase
  Future<Map<String, String>> getSocialLinks() async {
    try {
      final response = await _client
          .from(SupabaseTables.socialLinks)
          .select()
          .eq('is_visible', true);

      final Map<String, String> links = {};
      for (final json in response) {
        links[json['platform']] = json['url'];
      }
      return links;
    } catch (e) {
      print('Error fetching social links: $e');
      return {};
    }
  }

  // Fetch personal info from Supabase
  Future<Map<String, dynamic>?> getPersonalInfo() async {
    try {
      final response = await _client
          .from(SupabaseTables.personalInfo)
          .select()
          .limit(1)
          .maybeSingle();

      return response;
    } catch (e) {
      print('Error fetching personal info: $e');
      return null;
    }
  }

  // Real-time subscriptions for live updates
  Stream<List<Project>> subscribeToProjects() {
    return _client
        .from(SupabaseTables.projects)
        .stream(primaryKey: ['id']).map((List<Map<String, dynamic>> data) {
      return data.map((json) {
        return Project(
          id: json['id'],
          name: json['name'] ?? '',
          description: json['description'] ?? '',
          status: json['status'] ?? '',
          startDate: json['start_date'] != null
              ? DateTime.parse(json['start_date'])
              : DateTime.now(),
          endDate: json['end_date'] != null
              ? DateTime.parse(json['end_date'])
              : null,
          priority: json['priority'] ?? '',
          technologies: List<String>.from(json['technologies'] ?? []),
          role: json['role'] ?? '',
        );
      }).toList();
    });
  }

  Stream<List<Testimonial>> subscribeToTestimonials() {
    return _client
        .from(SupabaseTables.testimonials)
        .stream(primaryKey: ['id']).map((List<Map<String, dynamic>> data) {
      return data.map((json) {
        return Testimonial(
          id: json['id'],
          author: json['author'] ?? '',
          role: json['role'] ?? '',
          message: json['message'] ?? '',
          rating: (json['rating'] ?? 5.0).toDouble(),
          createdAt: json['created_at'] != null
              ? DateTime.parse(json['created_at'])
              : DateTime.now(),
        );
      }).toList();
    });
  }
}
