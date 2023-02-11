// ignore_for_file: prefer_const_constructors, prefer_const_literals_to_create_immutables

import "package:flutter/material.dart";
import 'package:online_bank/utill/app_bar.dart';
import 'package:online_bank/utill/bottom_app_bar.dart';
import 'package:readmore/readmore.dart';

class AboutPage extends StatefulWidget {
  final BuildContext context;

  AboutPage({
    required this.context,
  });

  @override
  State<AboutPage> createState() => _AboutPageState();
}

class _AboutPageState extends State<AboutPage> {
  String content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vitae auctor justo, vitae suscipit velit. Praesent laoreet malesuada ante quis rhoncus. Etiam ornare gravida sagittis. Vestibulum mattis mi pellentesque aliquet euismod. Nullam at diam erat. Ut massa arcu, tincidunt vitae dolor eget, gravida volutpat lacus. Nunc vulputate vitae massa quis porta. Duis quam metus, viverra mollis laoreet vel, molestie ut tortor. Donec at libero justo. Aliquam erat volutpat. Praesent ut tristique augue. Vivamus vel molestie arcu, eu finibus leo. Nullam sed felis efficitur, pellentesque mi eget, iaculis urna. Pellentesque finibus lectus magna, eget pulvinar leo ornare quis. Integer porttitor dolor quis eros pretium dignissim. Pellentesque blandit, augue eget pharetra lobortis, felis risus ornare lectus, at mattis ipsum neque at elit. Sed consectetur, dui ut dictum porttitor, diam erat pharetra massa, a porttitor dui diam lobortis lorem. Donec consequat leo finibus purus ornare, vel tempor nibh rutrum. Morbi at felis convallis, pellentesque lacus vel, hendrerit lacus. Aenean feugiat velit vel semper placerat. Sed lobortis vel lacus ac blandit. Phasellus lobortis odio ut magna scelerisque lobortis. Nullam rutrum tellus id ipsum dignissim, nec dignissim ante mattis. Nam quis ornare lacus. Fusce laoreet vitae tellus et semper';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300],
      bottomNavigationBar: AppBarBottom(context: context),
      resizeToAvoidBottomInset : false,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(children: [
            MyAppBar(first_name: 'За', second_name: 'Нас'),
          
            SingleChildScrollView(
              child: Container(
                padding: EdgeInsets.all(20),
                child: ReadMoreText(
                  content,
                  trimLines: 12,
                  textAlign: TextAlign.justify,
                  trimMode: TrimMode.Line,
                  trimCollapsedText: ' Покажи още ',
                  trimExpandedText: ' Покажи по-малко ',
        
                  lessStyle: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.blueGrey,
                  ),
        
                  moreStyle: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.blueGrey,
                  ),
        
                  style: TextStyle(
                    fontSize: 16,
                    height: 2,
                  ),
                  )
              ),
            )
          ],),
        ) 
        ),
    );
  }
}