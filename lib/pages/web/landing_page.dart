import 'package:ephraim_umunnakwe/pages/web/widgets/body_content.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/footer.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/header.dart';
import 'package:flutter/material.dart';

class LandingPage extends StatelessWidget {
  const LandingPage({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.max,
          children: [
            Header(),
            BodyContent(),
            Align(alignment: Alignment.bottomCenter, child: Footer()),
          ],
        ),
      ),
    );
  }
}
