import 'package:flutter/material.dart';
import 'journey_event.dart';

class JourneyMap extends StatelessWidget {
  const JourneyMap({super.key});

  @override
  Widget build(BuildContext context) {
    return const SingleChildScrollView(
      child: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            JourneyEvent(
              year: '2014',
              title: 'Exploration',
              description:
                  '- Began Learning C, C++ and Programming Fundamentals\n'
                  '- Also began learning about Microcontrollers due to my love for Robots',
            ),
            JourneyEvent(
              year: '2019',
              title: 'Started Learning Android',
              description: "Took the GADS 2019 Scolarship with Andela. "
                  "But dropped off at the exam couldn't complete it due to school😅",
            ),
            JourneyEvent(
              year: '2019',
              title: 'First Android Hobby Project',
              description:
                  'Although they never Kicked off due to finance at the time:\n'
                  '- Developed a simple to-do list app to practice core concepts in Android\n'
                  '- Developed a Store Keeper called (SMart)\n'
                  '- Developed a CGPA calculator for my Friends\n'
                  '\n\nThere are others but no need to bore you with that',
            ),
            JourneyEvent(
              year: '2020',
              title: 'Android Freelancing',
              description:
                  "Wasn't the best stint, but I'm glad I did it, I built\n"
                  "- A File Manager and Sharing app, using Java x XML.\n"
                  "- A direct Doctor-Patient communication platform using Java x XML.",
            ),
            JourneyEvent(
              year: '2020',
              title: 'Continued Android Learning',
              description: "I continued learning Android and Improving myself",
            ),
            JourneyEvent(
              year: '2020',
              title: 'Started Learning Flutter',
              description:
                  'By the end of the year I Completed introductory course on Flutter & Dart.',
            ),
            JourneyEvent(
              year: '2021',
              title: 'First Flutter Hobby Project',
              description:
                  'Developed a simple to-do list app to Practice State Management'
                  'and other Core Concepts',
            ),
            JourneyEvent(
              year: '2021',
              title: 'Advanced Learning',
              description: 'Completed advanced Flutter course.',
            ),
            JourneyEvent(
              year: '2021',
              title: 'Began Freelance Projects',
              description:
                  '- Built two differnt e-commerce app for two different local business.\n'
                  '- Built a Transcription App for a project student',
            ),
            JourneyEvent(
              year: '2021',
              title: 'Challenges',
              description:
                  "Up until this time I've faces a number of challenges, not just this year, but I never let it bring me down regardless, still solid.\n"
                  "\nHowever I kepts moving as, in my philosophy,that is the only way to be successful",
            ),
            JourneyEvent(
              year: '2021',
              title: 'Achievements',
              description:
                  "From the begining of my journey to this point I've earned several acolades some which are of most importance to me are:\n"
                  "- Aced the Android and Compose GADS Certification test."
                  "- Aced my LinkedIn Mobile Developer test",
            ),
            JourneyEvent(
              year: '2023',
              title:
                  'Major Project till data (Accross Personal, Freelancing, Jobs)',
              description:
                  'Developing a Successful Blockchain Integrated application',
            ),
            JourneyEvent(
              year: '2022',
              title: 'Community Contribution',
              description:
                  'Began contribution to open-source Flutter projects on GitHub.',
            ),
            JourneyEvent(
              year: '2023',
              title: 'New Role',
              description: 'Got my First Major Job at Televerse LLC',
            ),
            JourneyEvent(
              year: '2024',
              title: 'Ongoing Learning',
              description:
                  'Exploring Flutter\'s integration with AI and robotics. up until current date'
                  "\nVentured into Robotics and AI research Properly",
            ),
          ],
        ),
      ),
    );
  }
}
