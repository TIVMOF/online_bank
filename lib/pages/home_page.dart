// ignore_for_file: prefer_const_literals_to_create_immutables, prefer_const_constructors, sized_box_for_whitespace

import 'package:flutter/material.dart';
import 'package:online_bank/utill/my_card.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final _controller = PageController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      body: SafeArea(
        child: Column(children: [
          // app bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 25.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Text(
                      'My',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        ),
                      ),
                    Text(
                      ' Cards',
                      style: TextStyle(fontSize: 28),
                      ),
                  ],
                ),

                // plus button
                Container(
                  padding: EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: Colors.grey[400],
                    shape: BoxShape.circle,
                    ),
                  child: Icon(Icons.add)
                ),
                ],
              ),
          ),

          SizedBox(height: 25,),
      
          // cards
          Container(
            height: 200,
            child: PageView(
              scrollDirection: Axis.horizontal,
              controller: _controller,
              children: [
                MyCard(
                  balance: 5250.20,
                  cardNumber: 12345678,
                  expiryDate: 4,
                  expiryMonth: 10,
                  expiryYear: 24,
                  color: Colors.deepPurple,
                ),
                MyCard(
                  balance: 4250.24,
                  cardNumber: 11345678,
                  expiryDate: 5,
                  expiryMonth: 11,
                  expiryYear: 23,
                  color: Colors.deepOrange,
                ),
                MyCard(
                  balance: 250.99,
                  cardNumber: 12355678,
                  expiryDate: 3,
                  expiryMonth: 12,
                  expiryYear: 25,
                  color: Colors.blue,
                ),
                
            ],
            )
          ),

          SizedBox(height: 20),

          SmoothPageIndicator(
            controller: _controller, 
            count: 3,
            effect: ExpandingDotsEffect(
              activeDotColor: Colors.blue.shade900,
            ),
            ),

          // 3 buttons ->send + pay + bills
      
          // column -> stats + transaction
        ],),
      ),
    );
  }
}