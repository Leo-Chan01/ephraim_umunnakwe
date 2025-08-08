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
    url: "https://cecsvrwibdvncrxbbctr.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi"
        "JzdXBhYmFzZSIsInJlZiI6ImNlY3N2cndpYmR2bmNyeGJiY3RyIiwi"
        "cm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MjA3ODEsImV4cCI6MjA3MDA5"
        "Njc4MX0.dqSqaL37yCozA39pb61rnVzHmU0Jo_RH8vfisACAqS4",
  );

  runApp(MultiProvider(providers: [
    ChangeNotifierProvider<PortfolioDataProvider>(
        create: (context) => PortfolioDataProvider(SupabaseProjectsService())),
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
        designSize: const Size(1440, 900), // More reasonable design size
        minTextAdapt: true,
        splitScreenMode: true, // Enable split screen support
        ensureScreenSize: false, // Allow dynamic resizing
        useInheritedMediaQuery: true, // Better responsive behavior
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
