import 'package:animated_text_kit/animated_text_kit.dart';
import 'package:flutter/material.dart';

class TextBioWidget extends StatelessWidget {
  const TextBioWidget({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    var desktopWidth = MediaQuery.of(context).size.width;
    return SizedBox(
      width: desktopWidth,
      child: RichText(
        softWrap: true,
        textScaler: const TextScaler.linear(0.8),
        text: TextSpan(
          style: Theme.of(context)
              .textTheme
              .bodyLarge!
              .copyWith(color: Colors.white),
          children: [
            const TextSpan(
              text: 'Hi there, ',
            ),
            const TextSpan(
              text: 'my name is \n',
            ),
            WidgetSpan(
              child: AnimatedTextKit(
                animatedTexts: [
                  TypewriterAnimatedText('Ephraim Umunnakwe,',
                      textStyle: Theme.of(context)
                          .textTheme
                          .headlineLarge!
                          .copyWith(color: Colors.yellow),
                      speed: const Duration(milliseconds: 60),
                      cursor: "|",
                      curve: Curves.easeInOut),
                ],
                totalRepeatCount: 100,
                pause: const Duration(milliseconds: 30000),
                displayFullTextOnTap: true,
                stopPauseOnTap: true,
              ),
            ),
            const TextSpan(
              text: "\nI'm a Mobile Developer with ",
              // style: GoogleFonts.poppins(color: Colors.white, fontSize: 20),
            ),
            TextSpan(
                text: ' over 4 years',
                style: Theme.of(context)
                    .textTheme
                    .bodyLarge!
                    .copyWith(color: Colors.yellow)),
            const TextSpan(
              text:
                  ' Experience working as a Mobile Developer (Android Native and Flutter)'
                  ' \nand Backend Engineer (Springboot and Node.js).',
            ),
            TextSpan(
                text:
                    '\n\nThis site was written with:\nFlutter x Node.js(Express)',
                style: Theme.of(context).textTheme.bodyLarge!.copyWith(
                    color: Colors.white, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }
}
