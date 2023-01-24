// ignore_for_file: prefer_const_constructors

import 'package:flutter/material.dart';

import '../pages/about_page.dart';
import '../pages/home_page.dart';

class MyBar extends StatelessWidget {
  const MyBar({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      bottomNavigationBar: BottomAppBar(
        color: Colors.grey[200],
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            IconButton(
              onPressed: (){
                Navigator.push(context, MaterialPageRoute(builder: (context) => MyAbout()));
              }, 
              icon: Icon(Icons.question_answer),
              iconSize: 25,
              color: Colors.blue.shade900,
              ),
            IconButton(
              onPressed: (){
                Navigator.push(context, MaterialPageRoute(builder: (context) => HomePage()));
              }, 
              icon: Icon(Icons.home),
              iconSize: 35,
              color: Colors.blue.shade900,
              ),
            IconButton(
              onPressed: (){
                Navigator.of(context).pop();
              }, 
              icon: Icon(Icons.arrow_back_ios),
              iconSize: 25,
              color: Colors.blue.shade900,
              ),
        ],),
      ),
    );
  }
}