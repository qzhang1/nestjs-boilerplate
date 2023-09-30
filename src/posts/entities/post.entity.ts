import { Max, Min } from 'class-validator';

class Post {
  userId: number;

  @Min(1)
  @Max(100)
  id: number;
  title: string;
  body: string;
}

export default Post;
