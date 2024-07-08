import 'package:ephraim_umunnakwe/pages/web/landing_page.dart';
import 'package:ephraim_umunnakwe/theme/theme.dart';
import 'package:ephraim_umunnakwe/view_models/providers/projects_provider.dart';
import 'package:ephraim_umunnakwe/view_models/providers/site_state_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  runApp(MultiProvider(providers: [
    ChangeNotifierProvider<ProjectsProvider>(
        create: (context) => ProjectsProvider()),
    ChangeNotifierProvider<SiteStateProvider>(
        create: (context) => SiteStateProvider())
  ], child: const MyApp()));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Ephraim Umunnakwe',
      theme: customTheme,
      initialRoute: '/home',
      routes: {
        '/home': (context) => const LandingPage(),
        // '/roadmap': (context) => MyRoadMap(),
        // '/dev-gigs': (context) => AppsPage(),
        // '/designs': (context) => DesignsPage()
      },
    );
  }
}
