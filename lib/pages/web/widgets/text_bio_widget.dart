import 'package:animated_text_kit/animated_text_kit.dart';
import 'package:flutter/material.dart';

class TextBioWidget extends StatelessWidget {
  const TextBioWidget({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    var desktopWidth = MediaQuery.of(context).size.width;
    return (desktopWidth > 600)
        ? SizedBox(
            width: desktopWidth,
            child: RichText(
              softWrap: true,
              textScaler: const TextScaler.linear(0.8),
              text: TextSpan(
                style: Theme.of(context).textTheme.bodyMedium,
                children: [
                  TextSpan(
                    text: 'Hi there, ',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  TextSpan(
                    text: 'my name is ',
                    style: Theme.of(context).textTheme.bodyMedium,
                  ),
                  WidgetSpan(
                    child: AnimatedTextKit(
                      animatedTexts: [
                        TypewriterAnimatedText(
                          'Ephraim Umunnakwe',
                          // textStyle: GoogleFonts.poppins(
                          //     color: Color.fromRGBO(254, 194, 96, 1),
                          //     textStyle: TextStyle(fontSize: desktopWidth / 40),
                          //     fontWeight: FontWeight.bold),
                          speed: const Duration(milliseconds: 20),
                        ),
                      ],
                      totalRepeatCount: 100,
                      pause: const Duration(milliseconds: 30000),
                      displayFullTextOnTap: true,
                      stopPauseOnTap: true,
                    ),
                  ),
                  const TextSpan(
                    text: ', a Mobile Developer with ',
                    // style: GoogleFonts.poppins(color: Colors.white, fontSize: 20),
                  ),
                  const TextSpan(
                    text: ' over 3 years',
                  ),
                  const TextSpan(
                    text:
                        ' Experience working as a Mobile Developer (Android Native and Flutter).',
                    // style: GoogleFonts.poppins(color: Colors.white, fontSize: 20),
                  ),
                  const TextSpan(
                    text: '\n\nThis site was written in flutter',
                    // style: GoogleFonts.poppins(
                    //     color: Theme.of(context).colorScheme.secondary,
                    //     fontSize: 14,
                    //     fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ),
          )
        : SizedBox(
            child: RichText(
            softWrap: true,
            textScaler: const TextScaler.linear(0.8),
            text: TextSpan(
              style: Theme.of(context).textTheme.bodyMedium,
              children: [
                TextSpan(
                  text: 'Hi there, ',
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
                TextSpan(
                  text: 'my name is ',
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
                WidgetSpan(
                  child: AnimatedTextKit(
                    animatedTexts: [
                      TypewriterAnimatedText(
                        'Ephraim Umunnakwe',
                        // textStyle: GoogleFonts.poppins(
                        //     color: Color.fromRGBO(254, 194, 96, 1),
                        //     textStyle: TextStyle(fontSize: desktopWidth / 20),
                        //     fontWeight: FontWeight.bold),
                        speed: const Duration(milliseconds: 50),
                      ),
                    ],
                    totalRepeatCount: 100,
                    pause: const Duration(milliseconds: 10000),
                    displayFullTextOnTap: true,
                    stopPauseOnTap: true,
                  ),
                ),
                const TextSpan(
                  text: ', a Mobile Developer with over',
                  // style: GoogleFonts.poppins(color: Colors.white, fontSize: 20),
                ),
                const TextSpan(text: ' 3 years'),
                const TextSpan(
                  text:
                      ' Experience working as a Mobile Developer (Android Native and Flutter).',
                  // style: GoogleFonts.poppins(color: Colors.white, fontSize: 20),
                ),
                const TextSpan(
                  text: '\n\nThis site was written in flutter',
                  // style: GoogleFonts.poppins(
                  //     color: Theme.of(context).colorScheme.secondary,
                  //     fontSize: 14,
                  //     fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ));
  }
}
