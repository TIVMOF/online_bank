// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables

import 'package:flutter/material.dart';
import 'package:online_bank/pages/about_page.dart';

import '../pages/home_page.dart';

class AppBarBottom extends StatelessWidget {
  final BuildContext context;

  AppBarBottom({
    required this.context
  });

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
                callAbout(this.context);
              },
            ),
            IconButton(
              icon: Icon(
                Icons.home,
                color: Colors.blue.shade800,
                ),
              onPressed: () {
                callHome(this.context);
              },
            ),
            IconButton(
              icon: Icon(
                Icons.arrow_back,
                color: Colors.blue.shade800,
                ),
              onPressed: () {
                callBack(this.context);
              },
            ),
          ],
        ),
      );
  }
}

void callAbout (BuildContext context){
   Navigator.push(context, MaterialPageRoute(builder: (context) => AboutPage(context: context,)));
}

void callHome (BuildContext context){
   Navigator.push(context, MaterialPageRoute(builder: (context) => HomePage()));
}

void callBack (BuildContext context){
   Navigator.pop(context);
}