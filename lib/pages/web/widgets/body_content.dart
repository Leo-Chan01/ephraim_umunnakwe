import 'package:avatar_glow/avatar_glow.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/custom_buttons.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/text_bio_widget.dart';
import 'package:ephraim_umunnakwe/utils/util_methods.dart';
import 'package:flutter/material.dart';
import 'feature_card.dart';

class BodyContent extends StatelessWidget {
  const BodyContent({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: getCurrentViewWidth(context),
            child: Row(
              mainAxisSize: MainAxisSize.max,
              children: [
                Expanded(
                  flex: 2,
                  child: MouseRegion(
                    cursor: SystemMouseCursors.click,
                    child: AvatarGlow(
                      glowShape: BoxShape.rectangle,
                      glowColor: const Color.fromARGB(255, 213, 216, 218),
                      glowCount: 2,
                      glowBorderRadius: BorderRadius.circular(
                          MediaQuery.of(context).size.shortestSide / 5),
                      duration: const Duration(milliseconds: 2000),
                      repeat: true,
                      animate: true,
                      // showTwoGlows: true,
                      curve: Curves.fastOutSlowIn,
                      // repeatPauseDuration: const Duration(milliseconds: 1000),
                      child: Material(
                        elevation: 8.0,
                        shape: const CircleBorder(),
                        child: CircleAvatar(
                          backgroundColor: Colors.transparent,
                          minRadius:
                              MediaQuery.of(context).size.shortestSide / 60,
                          maxRadius:
                              MediaQuery.of(context).size.shortestSide / 10,
                          child: ClipRRect(
                              borderRadius: BorderRadius.circular(200.0),
                              child:
                                  Image.asset('assets/images/profile_img.jpg')),
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 125),
                const Flexible(flex: 4, child: TextBioWidget()),
              ],
            ),
          ),
          const SizedBox(height: 150),
          const CustomButtons(),
          // const SizedBox(height: 150),
          // Column(
          //   crossAxisAlignment: CrossAxisAlignment.start,
          //   children: [
          //     Text(
          //       'Checkout my Github profile',
          //       style: Theme.of(context).textTheme.headlineLarge,
          //     ),
          //     const SizedBox(height: 20),
          //     const MouseRegion(
          //         cursor: SystemMouseCursors.click,
          //         // child: GithubWidget()
          //         ),
          //   ],
          // ),
          // const SizedBox(height: 50),
          // const Divider(color: Colors.orangeAccent),
          // const SizedBox(height: 20),
          // Column(
          //   crossAxisAlignment: CrossAxisAlignment.start,
          //   children: [
          //     const SizedBox(height: 20),
          //     Text(
          //       'I share my insights and publish content on Mobile Development,'
          //       ' I always retweet and post personal development and best '
          //       'practices for developers. Contact me through these platforms: ',
          //       style: Theme.of(context).textTheme.bodyMedium,
          //     ),
          //     const SizedBox(height: 10),
          //     // ContactMeWidget(),
          //     const SizedBox(height: 10),
          //     Text(
          //       "I'm open for Gigs and any opportunities in tech",
          //       style: Theme.of(context).textTheme.bodySmall,
          //     ),
          //     const SizedBox(height: 60),
          //     Column(
          //       children: [
          //         Row(
          //           crossAxisAlignment: CrossAxisAlignment.center,
          //           children: [
          //             // FaIcon(
          //             //   FontAwesomeIcons.copyright,
          //             //   color: Colors.grey,
          //             //   size: 14,
          //             // ),
          //             Text(
          //               " 2022",
          //               style: Theme.of(context).textTheme.bodySmall,
          //             ),
          //             Text(
          //               " | All rights reserved",
          //               style: Theme.of(context).textTheme.bodySmall,
          //             )
          //           ],
          //         )
          //       ],
          //     ),
          //   ],
          // ),
          const Text(
            'My assurance',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 20),
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              FeatureCard(
                icon: Icons.security,
                title: 'Security',
                description: 'Top-notch security for your Software',
              ),
              FeatureCard(
                icon: Icons.speed,
                title: 'Speed',
                description: 'Fast and reliable Software performance',
              ),
              FeatureCard(
                icon: Icons.support,
                title: 'Support',
                description: '24/7 customer support',
              ),
            ],
          ),
        ],
      ),
    );
  }
}
