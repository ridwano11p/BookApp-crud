// Books.js
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Books({ route }) {
  const { accessToken } = route.params;
  const [bookData, setBookData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false); // new state for confirmation modal
  const [selectedBook, setSelectedBook] = useState(null);
  const [newBookTitle, setNewBookTitle] = useState("");
  const [newBookPublicationYear, setNewBookPublicationYear] = useState("");
  const [newBookScore, setNewBookScore] = useState("");
  const [newBookAuthor, setNewBookAuthor] = useState("");
  const [newBookImage, setNewBookImage] = useState("");
  const [newBookReviewText, setNewBookReviewText] = useState("");

  const fetchBookData = async () => {
    try {
      const url = "https://localhost:7026/api/Books";
      const options = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, options);
      const data = await response.json();

      if (data) {
        setBookData(data);
      } else {
        throw new Error("No book data in response");
      }
    } catch (error) {
      setError(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookData();
  }, []);

  // new useEffect hook to track bookData updates
  useEffect(() => {
    // do something with bookData here
    // for example, save it to local storage or send it to a server
    console.log("bookData has changed:", bookData);
  }, [bookData]);

  const addBook = async () => {
    const newBook = {
      title: newBookTitle,
      publicationYear: parseInt(newBookPublicationYear),
      score: parseInt(newBookScore),
      author: newBookAuthor,
      image: newBookImage,
      reviewText: newBookReviewText,
    };

    try {
      const url = "https://localhost:7026/api/Books";
      const options = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBook),
      };

      const response = await fetch(url, options);
      const data = await response.json();

      if (response.ok) {
        setBookData((prevBookData) => [...prevBookData, data]);
        setModalVisible(false);
        clearForm();
      } else {
        throw new Error(data.message || "Failed to add book");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const editBook = async () => {
    if (!selectedBook) return;

    const updatedBook = {
      id: selectedBook.id,
      title: newBookTitle,
      publicationYear: parseInt(newBookPublicationYear),
      score: parseInt(newBookScore),
      author: newBookAuthor,
      image: newBookImage,
      reviewText: newBookReviewText,
    };

    try {
      const url = `https://localhost:7026/api/Books/${updatedBook.id}`;
      const options = {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedBook),
      };

      const response = await fetch(url, options);
      const data = await response.json();

      if (response.ok) {
        setBookData((prevBookData) =>
          prevBookData.map((book) => (book.id === data.id ? data : book))
        );
        setEditModalVisible(false);
        setSelectedBook(null);
      } else {
        throw new Error(data.message || "Failed to update book");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBook = async () => {
    if (!selectedBook) return;

    try {
      const url = `https://localhost:7026/api/Books/${selectedBook.id}`;
      const options = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, options);

      if (response.ok) {
        setBookData((prevBookData) =>
          prevBookData.filter((book) => book.id !== selectedBook.id)
        );
        setEditModalVisible(false);
        setSelectedBook(null);
        setConfirmModalVisible(false); // close the confirmation modal after deleting
      } else {
        throw new Error("Failed to delete book");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // new function to toggle the confirmation modal
  const toggleConfirmModal = () => {
    setConfirmModalVisible((prev) => !prev);
  };

  const clearForm = () => {
    setNewBookTitle("");
    setNewBookPublicationYear("");
    setNewBookScore("");
    setNewBookAuthor("");
    setNewBookImage("");
    setNewBookReviewText("");
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookContainer}
      onPress={() => {
        setSelectedBook(item);
        setNewBookTitle(item.title);
        setNewBookPublicationYear(item.publicationYear.toString());
        setNewBookScore(item.score.toString());
        setNewBookAuthor(item.author);
        setNewBookImage(item.image);
        setNewBookReviewText(item.reviewText);
        setEditModalVisible(true);
      }}
    >
      <Image style={styles.bookImage} source={{ uri: item.image }} />
      <Text style={styles.bookTitle}>{item.title}</Text>
      <Text style={styles.bookAuthor}>{item.author}</Text>
      <Text style={styles.bookScore}>Score: {item.score}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Button title="Retry" onPress={fetchBookData} />
        </View>
      ) : (
        <>
          <FlatList
            data={bookData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.bookGrid}
            ListEmptyComponent={
              <Text style={styles.emptyStateText}>No books available.</Text>
            }
          />
          <View style={styles.addButtonContainer}>
            <Button
              title="Add New Book"
              onPress={() => setModalVisible(true)}
            />
          </View>
        </>
      )}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add New Book</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={newBookTitle}
            onChangeText={setNewBookTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Publication Year"
            value={newBookPublicationYear}
            onChangeText={setNewBookPublicationYear}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Score"
            value={newBookScore}
            onChangeText={setNewBookScore}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Author"
            value={newBookAuthor}
            onChangeText={setNewBookAuthor}
          />
          <TextInput
            style={styles.input}
            placeholder="Image URL"
            value={newBookImage}
            onChangeText={setNewBookImage}
          />
          <TextInput
            style={styles.input}
            placeholder="Review Text"
            value={newBookReviewText}
            onChangeText={setNewBookReviewText}
            multiline
          />
          <View style={styles.modalButtonContainer}>
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
            <Button title="Add" onPress={addBook} />
          </View>
        </View>
      </Modal>
      <Modal visible={editModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Book</Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={newBookTitle}
            onChangeText={setNewBookTitle}
          />
          <TextInput
            style={styles.input}
            placeholder="Publication Year"
            value={newBookPublicationYear}
            onChangeText={setNewBookPublicationYear}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Score"
            value={newBookScore}
            onChangeText={setNewBookScore}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Author"
            value={newBookAuthor}
            onChangeText={setNewBookAuthor}
          />
          <TextInput
            style={styles.input}
            placeholder="Image URL"
            value={newBookImage}
            onChangeText={setNewBookImage}
          />
          <TextInput
            style={styles.input}
            placeholder="Review Text"
            value={newBookReviewText}
            onChangeText={setNewBookReviewText}
            multiline
          />
          <View style={styles.modalButtonContainer}>
            <Button title="Delete" onPress={toggleConfirmModal} />
            <Button title="Cancel" onPress={() => setEditModalVisible(false)} />
            <Button
              title="Save"
              onPress={() => {
                editBook();
                setEditModalVisible(false);
              }}
            />
          </View>
        </View>
      </Modal>

      <Modal visible={confirmModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text>Are you sure you want to delete this book?</Text>
          <View style={styles.modalButtonContainer}>
            <Button title="Yes" onPress={deleteBook} />
            <Button title="No" onPress={toggleConfirmModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },
  bookGrid: {
    padding: 10,
  },
  bookContainer: {
    width: "45%",
    margin: 5,
    borderRadius: 5,
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  bookImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
    borderRadius: 5,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  bookAuthor: {
    fontSize: 14,
    marginBottom: 5,
  },
  bookScore: {
    fontSize: 14,
    color: "green",
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: "center",
  },
  addButtonContainer: {
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
});
