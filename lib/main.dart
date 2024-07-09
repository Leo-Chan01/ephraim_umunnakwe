import 'package:ephraim_umunnakwe/pages/splash_screen.dart';
import 'package:ephraim_umunnakwe/pages/web/landing_page.dart';
import 'package:ephraim_umunnakwe/pages/web/routes/about_me.dart';
import 'package:ephraim_umunnakwe/pages/web/routes/api_projects.dart';
import 'package:ephraim_umunnakwe/pages/web/routes/app_projects.dart';
import 'package:ephraim_umunnakwe/pages/web/routes/app_routes.dart';
import 'package:ephraim_umunnakwe/theme/theme.dart';
import 'package:ephraim_umunnakwe/view_models/providers/gradient_notifier.dart';
import 'package:ephraim_umunnakwe/view_models/providers/projects_provider.dart';
import 'package:ephraim_umunnakwe/view_models/providers/site_state_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:provider/provider.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  runApp(MultiProvider(providers: [
    ChangeNotifierProvider<ProjectsProvider>(
        create: (context) => ProjectsProvider()),
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
        // designSize: const Size(360, 690),
        designSize: const Size(1920, 800),
        minTextAdapt: true,
        splitScreenMode: false,
        ensureScreenSize: true,
        builder: (context, child) {
          return MaterialApp(
            debugShowCheckedModeBanner: false,
            title: 'Ephraim Umunnakwe',
            theme: customTheme,
            initialRoute: '/',
            routes: {
              '/': (context) => const SplashScreen(),
              AppRoutes.homePage: (context) => const LandingPage(),
              AppRoutes.aboutMe: (context) => AboutMe(),
              AppRoutes.myAppsPage: (context) => const AppProjects(),
              AppRoutes.myApiPages: (context) => const ApiProjects()
            },
          );
        });
  }
}
