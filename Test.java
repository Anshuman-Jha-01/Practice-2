// // You are building a banking transaction reconciliation module for an enterprise system.

// // There are two tables:

// // CREATE TABLE accounts (
// //     account_id BIGINT PRIMARY KEY,
// //     account_holder VARCHAR(100),
// //     balance DECIMAL(15,2),
// //     status VARCHAR(20)
// // );

// // CREATE TABLE transactions (
// //     txn_id BIGINT PRIMARY KEY,
// //     from_account BIGINT,
// //     to_account BIGINT,
// //     amount DECIMAL(15,2),
// //     txn_type VARCHAR(20),
// //     txn_status VARCHAR(20),
// //     created_at TIMESTAMP,
// //     remarks VARCHAR(255)
// // );
// // Business scenario

// // Implement a JDBC-based fund transfer operation with these rules:

// // Transfer money from one account to another.
// // Validate:
// // both accounts exist
// // both accounts are ACTIVE
// // sender has sufficient balance
// // transfer amount must be greater than 0
// // The operation must be fully transactional.
// // Insert a row in transactions.
// // Update sender and receiver balances.
// // If any step fails, rollback everything.
// // Prevent race conditions when two transfers hit the same account at the same time.
// // Use proper exception handling and resource management.
// // Return the generated transaction status message.

// import java.sql.*;

// public class Test {

//     private Connection getConnection() throws SQLException {
//         // Replace with your datasource or DriverManager
//         return DriverManager.getConnection("jdbc:mysql://localhost:3306/bankdb", "user", "password");
//     }

//     public String transferFunds(long fromAccountId, long toAccountId, double amount, String remarks) {
//         if (amount <= 0) {
//             return "Transfer failed: Amount must be greater than zero.";
//         }

//         String txnStatus = "FAILED";

//         try (Connection conn = getConnection()) {
//             conn.setAutoCommit(false);

//             // Step 1: Lock both accounts to prevent race conditions
//             String lockQuery = "SELECT account_id, balance, status FROM accounts WHERE account_id IN (?, ?) FOR UPDATE";
//             try (PreparedStatement ps = conn.prepareStatement(lockQuery)) {
//                 ps.setLong(1, fromAccountId);
//                 ps.setLong(2, toAccountId);

//                 ResultSet rs = ps.executeQuery();

//                 double fromBalance = -1, toBalance = -1;
//                 String fromStatus = null, toStatus = null;
//                 boolean fromFound = false, toFound = false;

//                 while (rs.next()) {
//                     long accId = rs.getLong("account_id");
//                     if (accId == fromAccountId) {
//                         fromBalance = rs.getDouble("balance");
//                         fromStatus = rs.getString("status");
//                         fromFound = true;
//                     } else if (accId == toAccountId) {
//                         toBalance = rs.getDouble("balance");
//                         toStatus = rs.getString("status");
//                         toFound = true;
//                     }
//                 }

//                 // Step 2: Validate accounts
//                 if (!fromFound || !toFound) {
//                     conn.rollback();
//                     return "Transfer failed: One or both accounts do not exist.";
//                 }
//                 if (!"ACTIVE".equalsIgnoreCase(fromStatus) || !"ACTIVE".equalsIgnoreCase(toStatus)) {
//                     conn.rollback();
//                     return "Transfer failed: One or both accounts are not ACTIVE.";
//                 }
//                 if (fromBalance < amount) {
//                     conn.rollback();
//                     return "Transfer failed: Insufficient balance.";
//                 }

//                 // Step 3: Update balances
//                 String updateBalance = "UPDATE accounts SET balance = ? WHERE account_id = ?";
//                 try (PreparedStatement updatePs = conn.prepareStatement(updateBalance)) {
//                     // Deduct from sender
//                     updatePs.setDouble(1, fromBalance - amount);
//                     updatePs.setLong(2, fromAccountId);
//                     updatePs.executeUpdate();

//                     // Add to receiver
//                     updatePs.setDouble(1, toBalance + amount);
//                     updatePs.setLong(2, toAccountId);
//                     updatePs.executeUpdate();
//                 }

//                 // Step 4: Insert transaction record
//                 String insertTxn = "INSERT INTO transactions (txn_id, from_account, to_account, amount, txn_type, txn_status, created_at, remarks) "
//                         + "VALUES (NULL, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?)";
//                 try (PreparedStatement txnPs = conn.prepareStatement(insertTxn, Statement.RETURN_GENERATED_KEYS)) {
//                     txnPs.setLong(1, fromAccountId);
//                     txnPs.setLong(2, toAccountId);
//                     txnPs.setDouble(3, amount);
//                     txnPs.setString(4, "TRANSFER");
//                     txnPs.setString(5, "SUCCESS");
//                     txnPs.setString(6, remarks);

//                     txnPs.executeUpdate();

//                     ResultSet keys = txnPs.getGeneratedKeys();
//                     if (keys.next()) {
//                         long txnId = keys.getLong(1);
//                         txnStatus = "Transfer successful. Transaction ID: " + txnId;
//                     }
//                 }

//                 // Step 5: Commit transaction
//                 conn.commit();
//             } catch (Exception e) {
//                 conn.rollback();
//                 txnStatus = "Transfer failed: " + e.getMessage();
//             }

//         } catch (SQLException e) {
//             txnStatus = "Database error: " + e.getMessage();
//         }

//         return txnStatus;
//     }
// }

import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.*;

public class Test {
    public static void main(String args[]) {
        // List<Integer> nums = Arrays.asList(1,2,3,4,5,6,7);
        // Stream<Integer> stream = nums.stream();
        // System.out.println(stream.filter((e) -> e%2==0).map((e) ->
        // e*e).collect(Collectors.toList()));

        // String[] names = {"Anshuman", "Arjun", "Amit", "Ravi", "Amit"};
        // Stream<String> stream2 = Arrays.stream(names);
        // stream2.distinct().filter((name) ->
        // name.startsWith("A")).forEach(System.out::println);

        // List<Integer> salaries = Arrays.asList(20000, 45000, 60000, 28000, 70000,
        // 50000);
        // Stream<Integer> stream3 = salaries.stream();

        // System.out.println(stream3.filter((sal) -> sal>50000).count());

        // Stream<Integer> stream4 = Stream.of(1,2,3,4,5);
        // System.out.println(stream4.reduce(1, (a, b) -> a*b));

        // Stream<String> stream5 = Arrays.stream(names);
        // stream5.sorted().limit(3).forEach(System.out::println);

        List<Integer> transactions = Arrays.asList(1000, 2500, 3000, 1500, 2000);
        Stream<Integer> stream = transactions.stream();

        System.out.println(stream.reduce(0, (a, b) -> a+b));
    }
}
