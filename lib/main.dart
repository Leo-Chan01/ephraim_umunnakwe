import 'package:ephraim_umunnakwe/pages/web/routes/app_routes.dart';
import 'package:ephraim_umunnakwe/theme/theme.dart';
import 'package:ephraim_umunnakwe/view_models/api_service/projects_service.dart';
import 'package:ephraim_umunnakwe/view_models/providers/gradient_notifier.dart';
import 'package:ephraim_umunnakwe/view_models/providers/projects_provider.dart';
import 'package:ephraim_umunnakwe/view_models/providers/site_state_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:provider/provider.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Supabase.initialize(
    url: "https://pshdmjovbpszjeqhlbrj.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3"
        "MiOiJzdXBhYmFzZSIsInJlZiI6InBzaGRtam92YnBzemplcWhsY"
        "nJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzNDkzMTgsImV4cCI6"
        "MjA1MTkyNTMxOH0.85Cf25KlmnwRADZaiGBCFmIjo_BuI2r3cjkfLjstXrA",
  );

  runApp(MultiProvider(providers: [
    ChangeNotifierProvider<ProjectsProvider>(
        create: (context) => ProjectsProvider(SupabaseProjectsService())),
    ChangeNotifierProvider<SiteStateProvider>(
        create: (context) => SiteStateProvider()),
    ChangeNotifierProvider<GradientNotifier>(
        create: (context) => GradientNotifier())
  ], child: const MyApp()));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
        designSize: const Size(1920, 800),
        minTextAdapt: true,
        splitScreenMode: false,
        ensureScreenSize: true,
        builder: (context, child) {
          return MaterialApp.router(
            debugShowCheckedModeBanner: false,
            title: 'Ephraim Umunnakwe',
            theme: customTheme,
            routerConfig: AppRoutes.router,
          );
        });
  }
}
