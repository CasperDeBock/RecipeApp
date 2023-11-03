export default function Loader({ loading }) {
  if (loading) {
    return <Text>Loading...</Text>;
  }

  return null;
}
