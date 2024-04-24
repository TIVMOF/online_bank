// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables, unused_import
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../pages/about_page.dart';

import '../pages/home_page.dart';

class AppBarBottom extends StatelessWidget {
  final String fullName;
  final int userId;
  final BuildContext context;

  AppBarBottom(
      {required this.context, required this.fullName, required this.userId});

  @override
  Widget build(BuildContext context) {
    return BottomAppBar(
      color: Colors.grey.shade200,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: <Widget>[
          IconButton(
            icon: Icon(
              Icons.question_answer,
              color: Colors.blue.shade800,
            ),
            onPressed: () {
              HapticFeedback.vibrate();
              Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => AboutPage(
                            context: context,
                            fullName: fullName,
                            userId: userId,
                          )));
            },
          ),
          IconButton(
            icon: Icon(
              Icons.home,
              color: Colors.blue.shade800,
            ),
            onPressed: () {
              HapticFeedback.vibrate();
              Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) =>
                          HomePage(fullName: fullName, userId: userId)));
            },
          ),
          IconButton(
            icon: Icon(
              Icons.arrow_back,
              color: Colors.blue.shade800,
            ),
            onPressed: () {
              HapticFeedback.vibrate();
              Navigator.pop(context);
            },
          ),
        ],
      ),
    );
  }
}
