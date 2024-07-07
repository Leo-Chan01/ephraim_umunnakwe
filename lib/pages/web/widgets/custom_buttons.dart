import 'package:ephraim_umunnakwe/pages/web/widgets/outline_custom_button.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:url_launcher/url_launcher.dart';

class CustomButtons extends StatelessWidget {
  const CustomButtons({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    var desktopWidth = MediaQuery.of(context).size.width;
    return Center(
      child: Wrap(
        spacing: 24,
        runSpacing: 24,
        children: [
          GestureDetector(
            onTap: () async {
              await launchUrl(Uri.parse('https://github.com/Leo-Chan01'));
            },
            child: CustomOutlinedButton(
              title: 'More Info.',
              icon: (desktopWidth < 600)
                  ? const FaIcon(
                      FontAwesomeIcons.user,
                      color: Colors.black,
                      size: 14,
                    )
                  : const FaIcon(
                      FontAwesomeIcons.user,
                      color: Colors.black,
                    ),
              direction: '/roadmap',
              backgroundColor: Colors.white,
              shadowColor: Colors.orange,
              outlineColor: Colors.orangeAccent,
              textColor: Colors.black,
            ),
          ),
          CustomOutlinedButton(
            title: 'Apps',
            icon: (desktopWidth < 600)
                ? const FaIcon(
                    FontAwesomeIcons.code,
                    color: Colors.black,
                    size: 14,
                  )
                : const FaIcon(
                    FontAwesomeIcons.code,
                    color: Colors.black,
                  ),
            direction: '/dev-gigs',
            backgroundColor: Colors.white,
            shadowColor: Colors.blue,
            outlineColor: Colors.blueAccent,
            textColor: Colors.black,
          ),
          CustomOutlinedButton(
            title: 'Design',
            icon: (desktopWidth < 600)
                ? const FaIcon(
                    FontAwesomeIcons.penFancy,
                    color: Colors.black,
                    size: 14,
                  )
                : const FaIcon(
                    FontAwesomeIcons.penFancy,
                    color: Colors.black,
                  ),
            direction: '/designs',
            backgroundColor: Colors.white,
            shadowColor: Colors.white,
            outlineColor: Colors.greenAccent,
            textColor: Colors.black,
          ),
          CustomOutlinedButton(
            title: 'Hire me',
            icon: (desktopWidth < 600)
                ? const FaIcon(
                    FontAwesomeIcons.handshake,
                    color: Colors.black,
                    size: 14,
                  )
                : const FaIcon(
                    FontAwesomeIcons.handshake,
                    color: Colors.black,
                  ),
            direction: '/roadmap',
            backgroundColor: Colors.white,
            shadowColor: Colors.greenAccent,
            outlineColor: Colors.greenAccent,
            textColor: Colors.black,
          ),
        ],
      ),
    );
  }
}
