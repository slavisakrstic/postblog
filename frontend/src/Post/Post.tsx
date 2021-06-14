// Material UI
import { Box, Container, Typography } from "@material-ui/core";

// Custom components
import Loading from "../Loading";
import PostCard from "../PostCard";

// Hooks
import { useFatchPosts } from "./hooks/useFatchPosts";

const Post = () => {
  const { data, isLoading, setFetch } = useFatchPosts();

  if (isLoading) {
    return (
      <Loading />
    );
  }

  const postCards = data?.map(item => (<PostCard 
    post={item} 
    key={item.id}
    refetch={setFetch}
  />))
  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          {postCards}
        </Typography>
      </Box>
    </Container>
  );
};

export default Post;