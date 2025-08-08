import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/portfolio_data.dart';
import 'supabase_config.dart';

class SupabaseService {
  final SupabaseClient _client = SupabaseConfig.client;

  // Projects CRUD Operations
  Future<List<Project>> getProjects() async {
    try {
      final response = await _client
          .from(SupabaseTables.projects)
          .select()
          .order('created_at', ascending: false);

      return (response as List).map((json) => Project.fromJson(json)).toList();
    } catch (e) {
      print('Error fetching projects: $e');
      return [];
    }
  }

  Future<Project?> addProject(Project project) async {
    try {
      final projectData = project.toJson();
      projectData.remove('id'); // Remove id for insert

      final response = await _client
          .from(SupabaseTables.projects)
          .insert(projectData)
          .select()
          .single();

      return Project.fromJson(response);
    } catch (e) {
      print('Error adding project: $e');
      return null;
    }
  }

  Future<Project?> updateProject(Project project) async {
    try {
      final response = await _client
          .from(SupabaseTables.projects)
          .update(project.toJson())
          .eq('id', project.id!)
          .select()
          .single();

      return Project.fromJson(response);
    } catch (e) {
      print('Error updating project: $e');
      return null;
    }
  }

  Future<bool> deleteProject(int id) async {
    try {
      await _client.from(SupabaseTables.projects).delete().eq('id', id);
      return true;
    } catch (e) {
      print('Error deleting project: $e');
      return false;
    }
  }

  // Testimonials CRUD Operations
  Future<List<Testimonial>> getTestimonials() async {
    try {
      final response = await _client
          .from(SupabaseTables.testimonials)
          .select()
          .order('created_at', ascending: false);

      return (response as List)
          .map((json) => Testimonial.fromJson(json))
          .toList();
    } catch (e) {
      print('Error fetching testimonials: $e');
      return [];
    }
  }

  Future<Testimonial?> addTestimonial(Testimonial testimonial) async {
    try {
      final testimonialData = testimonial.toJson();
      testimonialData.remove('id'); // Remove id for insert

      final response = await _client
          .from(SupabaseTables.testimonials)
          .insert(testimonialData)
          .select()
          .single();

      return Testimonial.fromJson(response);
    } catch (e) {
      print('Error adding testimonial: $e');
      return null;
    }
  }

  Future<Testimonial?> updateTestimonial(Testimonial testimonial) async {
    try {
      final response = await _client
          .from(SupabaseTables.testimonials)
          .update(testimonial.toJson())
          .eq('id', testimonial.id!)
          .select()
          .single();

      return Testimonial.fromJson(response);
    } catch (e) {
      print('Error updating testimonial: $e');
      return null;
    }
  }

  Future<bool> deleteTestimonial(int id) async {
    try {
      await _client.from(SupabaseTables.testimonials).delete().eq('id', id);
      return true;
    } catch (e) {
      print('Error deleting testimonial: $e');
      return false;
    }
  }

  // Social Links CRUD Operations
  Future<List<SocialLink>> getSocialLinks() async {
    try {
      final response = await _client
          .from(SupabaseTables.socialLinks)
          .select()
          .order('created_at', ascending: false);

      return (response as List)
          .map((json) => SocialLink.fromJson(json))
          .toList();
    } catch (e) {
      print('Error fetching social links: $e');
      return [];
    }
  }

  Future<SocialLink?> upsertSocialLink(SocialLink socialLink) async {
    try {
      final response = await _client
          .from(SupabaseTables.socialLinks)
          .upsert(socialLink.toJson())
          .select()
          .single();

      return SocialLink.fromJson(response);
    } catch (e) {
      print('Error upserting social link: $e');
      return null;
    }
  }

  Future<bool> deleteSocialLink(String platform) async {
    try {
      await _client
          .from(SupabaseTables.socialLinks)
          .delete()
          .eq('platform', platform);
      return true;
    } catch (e) {
      print('Error deleting social link: $e');
      return false;
    }
  }

  // Personal Info CRUD Operations
  Future<PersonalInfo?> getPersonalInfo() async {
    try {
      final response = await _client
          .from(SupabaseTables.personalInfo)
          .select()
          .limit(1)
          .maybeSingle();

      if (response != null) {
        return PersonalInfo.fromJson(response);
      }
      return null;
    } catch (e) {
      print('Error fetching personal info: $e');
      return null;
    }
  }

  Future<PersonalInfo?> upsertPersonalInfo(PersonalInfo personalInfo) async {
    try {
      final response = await _client
          .from(SupabaseTables.personalInfo)
          .upsert(personalInfo.toJson())
          .select()
          .single();

      return PersonalInfo.fromJson(response);
    } catch (e) {
      print('Error upserting personal info: $e');
      return null;
    }
  }

  // Real-time subscriptions
  Stream<List<Project>> subscribeToProjects() {
    return _client
        .from(SupabaseTables.projects)
        .stream(primaryKey: ['id']).map((List<Map<String, dynamic>> data) {
      return data.map((json) => Project.fromJson(json)).toList();
    });
  }

  Stream<List<Testimonial>> subscribeToTestimonials() {
    return _client
        .from(SupabaseTables.testimonials)
        .stream(primaryKey: ['id']).map((List<Map<String, dynamic>> data) {
      return data.map((json) => Testimonial.fromJson(json)).toList();
    });
  }

  Stream<List<SocialLink>> subscribeToSocialLinks() {
    return _client.from(SupabaseTables.socialLinks).stream(
        primaryKey: ['platform']).map((List<Map<String, dynamic>> data) {
      return data.map((json) => SocialLink.fromJson(json)).toList();
    });
  }

  Stream<PersonalInfo?> subscribeToPersonalInfo() {
    return _client
        .from(SupabaseTables.personalInfo)
        .stream(primaryKey: ['id']).map((List<Map<String, dynamic>> data) {
      return data.isNotEmpty ? PersonalInfo.fromJson(data.first) : null;
    });
  }
}
