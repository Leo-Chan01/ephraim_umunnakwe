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
      child: const Column(
        children: [
          SelectableText(
            'Contact Me',
            style: TextStyle(
              fontSize: 20,
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
          SizedBox(height: 10),
          SelectableText(
            'Email: ephraimleo16@gmail.com',
            style: TextStyle(
              fontSize: 16,
              color: Colors.white70,
            ),
          ),
          SizedBox(height: 5),
          SelectableText(
            'Phone: +234 811 636 9105',
            style: TextStyle(
              fontSize: 16,
              color: Colors.white70,
            ),
          ),
          SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              FaIcon(FontAwesomeIcons.xTwitter, color: Colors.white),
              SizedBox(width: 10),
              FaIcon(FontAwesomeIcons.instagram, color: Colors.white),
              SizedBox(width: 10),
              Icon(Icons.facebook, color: Colors.white),
              SizedBox(width: 10),
              FaIcon(FontAwesomeIcons.hashnode, color: Colors.white),
            ],
          ),
        ],
      ),
    );
  }
}
