import 'package:ephraim_umunnakwe/pages/web/routes/app_routes.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/gradient_container.dart';
import 'package:ephraim_umunnakwe/utils/util_methods.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class AboutMe extends StatelessWidget {
  AboutMe({super.key});

  final gestureRecogniser = TapGestureRecognizer();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GradientContainer(
        child: Stack(
          children: [
            SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  mainAxisSize: MainAxisSize.max,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 80),
                    Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            flex: 3,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                SelectableText(
                                  'About Me',
                                  style: Theme.of(context)
                                      .textTheme
                                      .headlineLarge!
                                      .copyWith(
                                          color: Colors.white,
                                          fontWeight: FontWeight.bold),
                                ),
                                SelectableText.rich(
                                  textAlign: TextAlign.start,
                                  TextSpan(
                                      text: 'My name is ',
                                      spellOut: true,
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodyMedium!
                                          .copyWith(color: Colors.white),
                                      children: [
                                        TextSpan(
                                          text: 'Ephraim Umunnakwe',
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodyMedium!
                                              .copyWith(
                                                  color: Colors.yellow,
                                                  fontWeight: FontWeight.bold,
                                                  fontFamily: 'Avenir'),
                                        ),
                                        const TextSpan(text: ', I hail from  '),
                                        TextSpan(
                                          text: 'Imo State, Nigeria. ',
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodyMedium!
                                              .copyWith(
                                                  color: Colors.yellow,
                                                  fontWeight: FontWeight.bold,
                                                  fontFamily: 'Avenir'),
                                        ),
                                        const TextSpan(
                                            text: 'My friends call me Leo.'),
                                        const TextSpan(
                                            text: '\n\nI own a new Startup '),
                                        TextSpan(
                                          text: 'Raym Universe Limited',
                                          recognizer: gestureRecogniser
                                            ..onTap = () async {
                                              await openLink(
                                                  'https://theraymuniverse.com');
                                            },
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodyMedium!
                                              .copyWith(
                                                  color: Colors.orange,
                                                  fontWeight: FontWeight.bold,
                                                  fontFamily: 'Avenir'),
                                        ),
                                      ]),
                                )
                              ],
                            ),
                          ),
                          Expanded(
                              flex: 2,
                              child: ClipRRect(
                                  borderRadius: BorderRadius.circular(50),
                                  child: Image.asset(
                                      fit: BoxFit.cover,
                                      'assets/images/profile_img.jpg')))
                        ])
                  ],
                ),
              ),
            ),
            CustomBackButton(clickAction: () {
              Navigator.pushNamed(context, AppRoutes.homePage);
            })
          ],
        ),
      ),
    );
  }
}

class CustomBackButton extends StatelessWidget {
  final Function() clickAction;
  const CustomBackButton({
    super.key,
    required this.clickAction,
  });

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.topLeft,
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: InkWell(
          onTap: clickAction,
          child: Container(
            height: 30,
            width: 100,
            decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.3),
                borderRadius: BorderRadius.circular(50)),
            child: const Center(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  FaIcon(
                    FontAwesomeIcons.arrowLeft,
                    color: Colors.white,
                  ),
                  SizedBox(width: 10),
                  SelectableText(
                    "back",
                    style: TextStyle(color: Colors.white),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
