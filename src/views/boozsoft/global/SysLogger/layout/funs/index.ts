import { inject } from 'vue';

type Hello = {
  reloadTableByYearAndMonthAndDay(e): void;
  reloadTableByYearAndMonth(e): void;
  register(e): void;
};

export function getLoggerTableFuns(): Hello {
  return <Hello>inject('loggerTableFuns');
}

export function useLoggerTable(): Hello {
  let instance = null;
  return {
    type:'month',
    year:'2022',
    month:'11',
    day:'1',
    register(e) {
      instance = e;
    },
    reloadTableByYearAndMonth(e) {
      instance.reloadTableByYearAndMonth(e);
    },
    reloadTableByYearAndMonthAndDay(e) {
      instance.reloadTableByYearAndMonth(e);
    },
  };
}
