import 'package:ephraim_umunnakwe/pages/web/routes/app_routes.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/outline_custom_button.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:url_launcher/url_launcher.dart';

class CustomButtonsMobile extends StatelessWidget {
  const CustomButtonsMobile({
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    var desktopWidth = MediaQuery.of(context).size.width;
    return Center(
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Colors.grey.withOpacity(0.1),
              const Color.fromRGBO(158, 158, 158, 1).withOpacity(0.3),
            ],
          ),
        ),
        width: double.infinity,
        child: Padding(
          padding: const EdgeInsets.all(22.2),
          child: Center(
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
                    direction: AppRoutes.aboutMe,
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
                  direction: AppRoutes.myAppsPage,
                  backgroundColor: Colors.white,
                  shadowColor: Colors.blue,
                  outlineColor: Colors.blueAccent,
                  textColor: Colors.black,
                ),
                CustomOutlinedButton(
                  title: 'APIs',
                  icon: (desktopWidth < 600)
                      ? const FaIcon(
                          FontAwesomeIcons.gears,
                          color: Colors.black,
                          size: 14,
                        )
                      : const FaIcon(
                          FontAwesomeIcons.gears,
                          color: Colors.black,
                        ),
                  direction: AppRoutes.myApiPages,
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
                  direction: AppRoutes.aboutMe,
                  backgroundColor: Colors.white,
                  shadowColor: Colors.greenAccent,
                  outlineColor: Colors.greenAccent,
                  textColor: Colors.black,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
