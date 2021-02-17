import styled from 'styled-components';

import logo from './logo.svg';

import TimelineChart from './TimelineChart';

let config = {
  nodes: [
    { name: '1Story I / 1通常', round: 1 }, // 0
    { name: '1Story I / 2Happy Valentine', round: 1 }, // 1

    { name: '2Story II / 1通常', round: 2 }, // 2
    { name: '2Story II / 2チョコ集め', round: 2 },

    { name: '3Story III / 1通常', round: 3 }, // 4
    { name: '3Story III / 2ドレスアップ', round: 3 }, // 5

    { name: '4Story IV / 1通常', round: 4 }, // 6
    { name: '5Real Event / 1PARTY I', round: 5 }, // 7
    { name: '5Real Event / 2PARTY II', round: 6 },
    { name: '5Real Event / 3PARTY III', round: 7 }, // 9
    { name: '6總和 / 1個人', round: 8 },
    { name: '5Real Event / 4Valentine Party', round: 9 }, // 11
    { name: '5Real Event / 5ショコラチャレンジ', round: 9 }, // 12
  ],
  links: [
    { source: 0, target: 2, mechanism: 'lockBonus' },
    { source: 0, target: 4, mechanism: 'lockBonus' },
    { source: 2, target: 4, mechanism: 'lockBonus' },
    { source: 6, target: 7, mechanism: 'lockBonus' },
    { source: 6, target: 7, mechanism: 'inheritance' },
    { source: 7, target: 8, mechanism: 'lockBonus' },
    { source: 7, target: 10, mechanism: 'lockBonus' },
    { source: 8, target: 9, mechanism: 'lockBonus' },
    { source: 8, target: 10, mechanism: 'lockBonus' },
    { source: 9, target: 10, mechanism: 'lockBonus' },
    { source: 10, target: 11, mechanism: 'lockBonus' },
  ],
  times: [
    {
      label: '2021/01/29 00:00:00',
    },
    {
      label: '2021/02/05 00:00:00',
    },
    {
      label: '2021/02/12 00:00:00',
    },
    {
      label: '2021/02/14 12:00:00 ',
    },
    {
      label: '2021/02/14 19:15:00',
    },
    {
      label: '2021/02/14 19:45:00',
    },
    {
      label: '2021/02/14 20:15:00 ',
    },
    {
      label: '2021/02/14 20:20:00',
    },
    {
      label: '2021/02/14 20:50:00',
    },
  ],
};

function App() {
  return (
    <DiagramStyled>
      <Times>
        {config.times.map((t, i) => {
          return (
            <RoundEndTime key={t.label} index={i}>
              <Day>{t.label.split(' ')[0]}</Day>
              <Time>{t.label.split(' ')[1]}</Time>
            </RoundEndTime>
          );
        })}
      </Times>
      <Chart>
        <TimelineChart config={config} />
      </Chart>
    </DiagramStyled>
  );
}

const DiagramStyled = styled.div`
  display: flex;
  padding: 20px 20px;
  background-color: #222324;
`;

const Times = styled.div`
  width: 200px;
  color: #c9c9ce;
`;

const RoundEndTime = styled.div`
  height: 30px;
  border-bottom: 2px dashed #8a8a8a;
  display: flex;
  align-items: center;
  transform: ${(p) => `translate(0, ${70 * p.index}px)`};
`;

const Day = styled.span``;

const Time = styled.span`
  color: #77bafc;
  margin-left: 10px;
`;

const Chart = styled.div``;

export default App;
