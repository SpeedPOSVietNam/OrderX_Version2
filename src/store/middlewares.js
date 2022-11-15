import produce from 'immer';

// Turn the set method into an immer proxy
export const immer = config => (set, get, api) =>
  config(
    (partial, replace) => {
      const nextState =
        typeof partial === 'function' ? produce(partial) : partial;
      return set(nextState, replace);
    },
    get,
    api,
  );
