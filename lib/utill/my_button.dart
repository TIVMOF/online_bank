import 'package:flutter/material.dart';

class MyButton extends StatelessWidget {

  final String iconImagePath;
  final String buttonText;

  const MyButton({
    super.key,
    required this.iconImagePath,
    required this.buttonText
    });

  @override
  Widget build(BuildContext context) {
    return Column(
              children: [
                // icon
                Container(
                  height: 80,
                  padding: EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.grey[100],
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.grey.shade400,
                        blurRadius: 40,
                        spreadRadius: 10,
                      )
                    ],
                  ),
                  child: Center(
                    child: Image.asset(iconImagePath)),
                ),
                SizedBox(height: 7,),
                // text
                Text(
                  buttonText,
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.grey[700],
                    ),
                  ),
              ],
            );
  }
}