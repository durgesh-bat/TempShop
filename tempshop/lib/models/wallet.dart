class Wallet {
  final double balance;
  final List<Transaction> transactions;

  Wallet({required this.balance, required this.transactions});

  factory Wallet.fromJson(Map<String, dynamic> json) {
    return Wallet(
      balance: double.parse(json['balance'].toString()),
      transactions: (json['transactions'] as List?)
          ?.map((t) => Transaction.fromJson(t))
          .toList() ?? [],
    );
  }
}

class Transaction {
  final int id;
  final String type;
  final double amount;
  final String description;
  final String createdAt;

  Transaction({
    required this.id,
    required this.type,
    required this.amount,
    required this.description,
    required this.createdAt,
  });

  factory Transaction.fromJson(Map<String, dynamic> json) {
    return Transaction(
      id: json['id'],
      type: json['type'] ?? 'credit',
      amount: double.parse(json['amount'].toString()),
      description: json['description'] ?? '',
      createdAt: json['created_at'] ?? '',
    );
  }
}
