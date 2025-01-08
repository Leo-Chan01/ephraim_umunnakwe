import 'package:ephraim_umunnakwe/pages/splash_screen.dart';
import 'package:ephraim_umunnakwe/pages/web/landing_page.dart';
import 'package:ephraim_umunnakwe/pages/web/routes/about_me.dart';
import 'package:ephraim_umunnakwe/pages/web/routes/api_projects.dart';
import 'package:ephraim_umunnakwe/pages/web/routes/app_projects.dart';
import 'package:ephraim_umunnakwe/pages/web/routes/hire_me_screen.dart';
import 'package:go_router/go_router.dart';

class AppRoutes {
  static String splashScreenRoute = '/';
  static String homePage = '/home';
  static String aboutMe = '/about-me';
  static String hireMe = '/hire-me';
  static String myAppsPage = '/app-gigs';
  static String myApiPages = '/api-gigs';

  static final GoRouter router = GoRouter(routes: [
    GoRoute(
        path: AppRoutes.splashScreenRoute,
        builder: (context, state) => const SplashScreen()),
    GoRoute(
        path: AppRoutes.homePage,
        builder: (context, state) => const LandingPage()),
    GoRoute(path: AppRoutes.aboutMe, builder: (context, state) => AboutMe()),
    GoRoute(
        path: AppRoutes.hireMe,
        name: AppRoutes.hireMe,
        builder: (context, state) => const HireMeScreen()),
    GoRoute(
        path: AppRoutes.myAppsPage,
        name: AppRoutes.myAppsPage,
        builder: (context, state) => const AppProjects()),
    GoRoute(
        path: AppRoutes.myApiPages,
        name: AppRoutes.myApiPages,
        builder: (context, state) => const ApiProjects()),
  ]);
}
