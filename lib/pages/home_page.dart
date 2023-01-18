// ignore_for_file: prefer_const_literals_to_create_immutables, prefer_const_constructors, sized_box_for_whitespace

import 'package:flutter/material.dart';
import 'package:online_bank/utill/my_button.dart';
import 'package:online_bank/utill/my_card.dart';
import 'package:online_bank/utill/my_list_tile.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import 'package:online_bank/pages/Send_page.dart';

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
      floatingActionButton: FloatingActionButton(
        onPressed: () {}, 
        backgroundColor: Colors.blue.shade600,
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      bottomNavigationBar: BottomAppBar(
        color: Colors.grey[200],
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            IconButton(
              onPressed: (){}, 
              icon: Icon(Icons.home),
              iconSize: 30,
              color: Colors.blue.shade900,
              ),
            IconButton(
              onPressed: (){}, 
              icon: Icon(Icons.settings),
              iconSize: 30,
              color: Colors.blue.shade900,
              ),
        ],),
      ),
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

            SizedBox(height: 40),

          // 3 buttons ->send + pay + bills
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 25.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
              // send button
              ElevatedButton(
                onPressed: () {
                  Navigator.push(context, MaterialPageRoute(builder: (context) => MySend()));
                },
                style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.transparent,
                    foregroundColor: Colors.black,
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20))
                  ),
                child: MyButton(iconImagePath: 'lib/icons/send.png', buttonText: 'Send',)
              ),
              
              //pay button
              ElevatedButton(
                onPressed: () {
                  Navigator.push(context, MaterialPageRoute(builder: (context) => MySend()));
                },
                style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.transparent,
                    foregroundColor: Colors.black,
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20))
                  ),
                child: MyButton(iconImagePath: 'lib/icons/credit-card.png', buttonText: 'Pay',)
              ),

              //bills button
              ElevatedButton(
                onPressed: () {
                  Navigator.push(context, MaterialPageRoute(builder: (context) => MySend()));
                },
                style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.transparent,
                    foregroundColor: Colors.black,
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20))
                  ),
                child: MyButton(iconImagePath: 'lib/icons/bill.png', buttonText: 'Bills',)
              ),
            ],),
          ),
      
          // column -> stats + transaction
          Padding(
            padding: const EdgeInsets.all(25.0),
            child: Column(children: [
              //Stats
              MyListTile(
                iconImagePath: 'lib/icons/statistics.png', 
                tileTitle: 'Statistics', 
                tileSubtitle: 'Payments and Income'
              ),

              //Transactions
              MyListTile(
                iconImagePath: 'lib/icons/lending.png', 
                tileTitle: 'Transactions', 
                tileSubtitle: 'Transaction History'
              )
            ],),
          )
        ],),
      ),
    );
  }
}

MySend count() {
  return MySend();
}