import 'package:ephraim_umunnakwe/utils/util_methods.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class Footer extends StatelessWidget {
  final bool isDesktop;
  const Footer({super.key, required this.isDesktop});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      color: Colors.blueGrey[900],
      child: Column(
        children: [
          const SelectableText(
            'Contact Me',
            style: TextStyle(
              fontSize: 20,
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 10),
          const SelectableText(
            'Email: ephraimleo16@gmail.com',
            style: TextStyle(
              fontSize: 16,
              color: Colors.white70,
            ),
          ),
          const SizedBox(height: 5),
          const SelectableText(
            'Phone: +234 811 636 9105',
            style: TextStyle(
              fontSize: 16,
              color: Colors.white70,
            ),
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              InkWell(
                  onTap: () async {
                    await openLink('https://x.com/yfdtweets');
                  },
                  child:
                      const FaIcon(FontAwesomeIcons.xTwitter, color: Colors.white)),
              const SizedBox(width: 10),
              InkWell(
                  onTap: () async {
                    await openLink(
                        'https://instagram.com/your.favourite.developer');
                  },
                  child:
                      const FaIcon(FontAwesomeIcons.instagram, color: Colors.white)),
              const SizedBox(width: 10),
              const InkWell(child: Icon(Icons.facebook, color: Colors.white)),
              const SizedBox(width: 10),
              InkWell(
                  onTap: () async {
                    await openLink('https://kingraym.hashnode.dev/');
                  },
                  child:
                      const FaIcon(FontAwesomeIcons.hashnode, color: Colors.white)),
            ],
          ),
        ],
      ),
    );
  }
}
