import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class HelpCenterScreen extends StatelessWidget {
  const HelpCenterScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Help Center'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'How can we help you?',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 24),
            
            _buildSection('Frequently Asked Questions', [
              _buildFAQItem('How do I track my order?', 'Go to My Orders in your profile to track all your orders in real-time.'),
              _buildFAQItem('How do I cancel an order?', 'You can cancel orders that are still pending. Go to My Orders and select cancel.'),
              _buildFAQItem('What payment methods do you accept?', 'We accept credit cards, debit cards, and wallet payments.'),
              _buildFAQItem('How do I return an item?', 'Items can be returned within 7 days. Contact support for return instructions.'),
              _buildFAQItem('How do I add money to my wallet?', 'Go to Wallet in your profile and tap Add Money to top up your balance.'),
            ]),
            
            const SizedBox(height: 32),
            
            _buildSection('Contact Support', [
              _buildContactItem(Icons.email, 'Email Support', 'support@tempshop.com', () => _launchEmail(context)),
              _buildContactItem(Icons.phone, 'Call Support', '+1 (555) 123-4567', () => _launchPhone(context)),
              _buildContactItem(Icons.chat, 'Live Chat', 'Chat with us now', () => _showChatDialog(context)),
            ]),
            
            const SizedBox(height: 32),
            
            _buildSection('Account & Orders', [
              _buildHelpItem(Icons.person, 'Account Issues', 'Problems with login, profile, or settings'),
              _buildHelpItem(Icons.shopping_bag, 'Order Problems', 'Issues with placing, tracking, or receiving orders'),
              _buildHelpItem(Icons.payment, 'Payment Issues', 'Problems with payments, refunds, or wallet'),
              _buildHelpItem(Icons.local_shipping, 'Delivery Issues', 'Questions about shipping, delivery, or addresses'),
            ]),
            
            const SizedBox(height: 32),
            
            _buildSection('App Information', [
              _buildInfoItem('Version', '1.0.0'),
              _buildInfoItem('Last Updated', '2024'),
              _buildInfoItem('Platform', 'Android & iOS'),
            ]),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(String title, List<Widget> children) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 16),
        ...children,
      ],
    );
  }

  Widget _buildFAQItem(String question, String answer) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ExpansionTile(
        title: Text(question, style: const TextStyle(fontWeight: FontWeight.w500)),
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Text(answer, style: const TextStyle(color: Colors.grey)),
          ),
        ],
      ),
    );
  }

  Widget _buildContactItem(IconData icon, String title, String subtitle, VoidCallback onTap) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Icon(icon, color: Colors.blue),
        title: Text(title),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: onTap,
      ),
    );
  }

  Widget _buildHelpItem(IconData icon, String title, String subtitle) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: Icon(icon, color: Colors.blue),
        title: Text(title),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: () {},
      ),
    );
  }

  Widget _buildInfoItem(String title, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
          Text(value, style: const TextStyle(color: Colors.grey)),
        ],
      ),
    );
  }

  void _launchEmail(BuildContext context) {
    Clipboard.setData(const ClipboardData(text: 'support@tempshop.com'));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Email copied to clipboard')),
    );
  }

  void _launchPhone(BuildContext context) {
    Clipboard.setData(const ClipboardData(text: '+15551234567'));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Phone number copied to clipboard')),
    );
  }

  void _showChatDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Live Chat'),
        content: const Text('Live chat feature coming soon! Please use email or phone support for now.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK'),
          ),
        ],
      ),
    );
  }
}