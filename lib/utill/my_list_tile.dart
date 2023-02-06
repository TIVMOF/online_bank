// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables, unnecessary_this

import 'package:flutter/material.dart';

class MyListTile extends StatelessWidget {

  final String iconImagePath;
  final String tileTitle;
  final String tileSubtitle;
  final Widget page;

  const MyListTile({
    super.key,
    required this.iconImagePath,
    required this.tileTitle,
    required this.tileSubtitle,
    required this.page
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 25.0),
      child: ElevatedButton(
        onPressed: () {
          Navigator.push(context, MaterialPageRoute(builder: (context) => this.page));
        },
        style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.transparent,
                    foregroundColor: Colors.transparent,
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20))
                  ),
        child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
              //Icon
              Row(
                children: [
                  Container(
                    height: 80,
                    padding: EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.grey[100],
                      borderRadius: BorderRadius.circular(12.0),
                      ),
                    child: Image.asset(iconImagePath),
                    ),
      
                    SizedBox(width: 20,),
      
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                      Text(
                        tileTitle,
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 20,
                          )
                        ),
                      Text(
                        tileSubtitle,
                        style: TextStyle(
                          fontSize: 18,
                          )
                        ),
                    ],),
                ],
              ),
      
                Icon(Icons.arrow_forward_ios),
            ],),
      ),
    );
  }
}