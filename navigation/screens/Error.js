export default function Error({ error }) {
  if (error) {
    return (
      <View>
        <Text>Something went wrong</Text>
      </View>
    );
  }

  return null;
}
