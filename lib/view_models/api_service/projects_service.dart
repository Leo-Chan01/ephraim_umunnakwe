import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseProjectsService {
  final _supabase = Supabase.instance.client;

  Future<List<Map<String, dynamic>>> getProjects() async {
    final data = await _supabase.from('projects').select('*');
    return data;
  }
}
