type Trilean = true | false | 'pending';

const trileanResolve = (trilean: Trilean): boolean => {
  if (trilean === 'pending') {
    return false;
  }
  return trilean;
};

export { trileanResolve };
export default Trilean;
