<img width="100%" src="https://github.com/HyeyonJ/infiniteScrollByOnScroll/assets/113879120/6426b8cc-437a-4d9a-94d9-80dcfbdc58af.gif">

<div align="center">
<h2>무한 스크롤(Infinite Scroll) 구현</h2>
  채팅 프로젝트를 구현하면서, 무한 스크롤 기능에 대해서 공부한 기록입니다.
</div>

## 목차
  - [Infinite Scroll?](#Infinite-Scroll?)
  - [구현 방법 구분](#구현-방법-구분)
  - [onScroll Event](#onScroll=Event)
  - [아키텍처](#아키텍처)
  - [구현 화면](#구현-화면)
  - [구현 코드 설명](#구현-코드-설명)
  - [Reference](#Reference)

## Infinite Scroll?
  - Infinite scroll은 한 번에 모든 컨텐츠를 렌더링 하지 않고, 스크롤을 하면 새로운 컨텐츠를 덧붙여서 렌더링 하는 방식입니다. 정보를 한꺼번에 가져와서 보여주기엔 정보량이 너무 많아서 api fetch로 받는 결과가 느릴 때, 스크롤을 통해 일부 데이터만을 가져와 추가하는 방식으로 사용자 경험을 높이는 퍼포먼스이자 인터페이스라고 할 수 있습니다.
    
## 구현 방법 구분
  - Infinite Scroll 구현 방법은 크게 두 가지로 나뉩니다.
    - onScroll event
    - Interection Observer API
  - 이 곳에선 onScroll event로 구현했습니다.

## onScroll Event
  - MDN의 정의 : scrollend 요소 스크롤이 완료되면 시작됩니다. 스크롤 위치에 더이상 보류 중인 업데이트가 없고 사용자가 동작을 완료하면 스크롤이 완료된 것으로 간주됩니다. 
  - onScroll event 와 Intersection Observer API 둘 다 사용해 본 결과, 직관적으로 바로 이해 가능한 것은 onScroll event로 무한스크롤을 구현하는 것이었습니다. Intersection Observer API는 onScroll event 보다 값싼 비용으로 사용할 수 있다고 하는데, 이 부분에 대해서는 체감이 되지 않았습니다. 다만, onScroll event는 빈번한 이벤트 발생으로 성능 최적화를 위하서 throttle과 같은 처리가 필요하므로 Observer API가 유지보수 측면에서 편리하다고 생각합니다.
  - scroll Event

<div style="text-align : center;" >
  <img width="100%" src="https://github.com/HyeyonJ/infiniteScrollByOnScroll/assets/113879120/25ff902b-06be-45c2-8e81-b6377d886057.png">
</div>

  - 설명
    - clientHeight = 사용자가 현재 보는 높이
    - scrollTop = 사용자가 보는 페이지와 원래 페이지의 최상단과의 차이
    - scrollHeight = 화면의 높이값
   
    - 이를 활욯해서 스크롤이 바닥에 닿았을 시 실행될 함수식 scrollTop + clientHeigth >= scrollHeight 을 만들 수 있습니다.
    - 이를 addEventListener를 이웅해서 스크롤을 감시하면 됩니다. 이는 [구현 코드 설명](#구현-코드-설명)에서 자세히 설명하겠습니다.
    

## 아키텍처
<img width="100%" src="https://github.com/HyeyonJ/infiniteScrollByUseRef/assets/113879120/f84013e8-7687-44c7-8a8d-5b73ea04602c.png">

## 구현 화면
|![image](https://github.com/HyeyonJ/infiniteScrollByUseRef/assets/113879120/2a9e92cb-0916-4f17-bcea-9a2ceecde483)|![image](https://github.com/HyeyonJ/infiniteScrollByUseRef/assets/113879120/f0cc2fbd-8c19-4f44-b2f9-8368d2e0e2fb)|![image](https://github.com/HyeyonJ/infiniteScrollByUseRef/assets/113879120/87004c16-5fe0-4a81-80b7-aae0ed7388f5)|
|---|---|---|
|시작 화면|검색 데이터|스크롤 감지|

<irame src="https://codesandbox.io/s/infinitescrolluseref5-xfxhtf">


## 구현 코드 설명
```
  return (
    <div className="App">
      <h1 style={{ textAlign: "center" }}>Coin Gallery</h1>

      <div>
        {coinsDataRef.current &&
          coinsDataRef.current.map((coin, index) => {
            return (
              <div
                key={index}
                style={{
                  margin: "20px",
                  border: "1px solid black",
                  height: "200px",
                  textAlign: "center",
                  borderRadius: "10px"
                }}
              >
                <img
                  src={coin.image}
                  alt={coin.name}
                  style={{
                    margin: "10px",
                    // backgroundColor: "red",
                    height: "90px",
                    textAlign: "center"
                  }}
                />
                <br />
                {coin.name}
                <br />
                {coin.current_price}
              </div>
            );
          })}
      </div>
    </div>
  );
```
- coin 배열을 매핑하여 동적으로 도서 목록들을 불러 옵니다.

```
  const handleScroll = () => {
    if (noMoreData) {
      return;
    }
    console.log("Height:", document.documentElement.scrollHeight);
    console.log("Top:", document.documentElement.scrollTop);
    console.log("Window:", window.innerHeight);

    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setLoading(true);
      // loadingRef.current = true;
      // setPage((prev) => prev + 1);
      pageRef.current = pageRef.current + 1;
    }
  };
```
- 스크롤 동작을 처리하는 함수입니다. 사용자가 페이지 하단에 도달했는지 확인하고, 그렇다면 페이지 번호를 증가시켜 true로 'pageRef'를 설정합니다.
- window.innerHeight: 브라우저 창에서 보이는 부분의 높이입니다.
- document.documentElement.scrollTop: 문서의 현재 수직 스크롤 위치입니다.
- 1: 작은 오프셋(1 픽셀)이 추가됩니다. 이는 스크롤 정확도를 위해 사용되며 작은 스크롤 오류로 인한 예기치 않은 동작을 방지합니다.
- 페이지 하단에 도달하는 조건이 충족되면 다음 동작이 수행됩니다
    - setLoading(true);: 이것은 loading 상태를 true로 설정합니다. 주로 이것은 데이터가 불러와지고 있는 중임을 나타내는 로딩 스피너 또는 시각적인 표시를 활성화하기 위해 사용됩니다.
    - pageRef.current = pageRef.current + 1;: 이것은 pageRef.current 변수를 1 증가시킵니다. 주로 이것은 사용자가 다음 페이지의 데이터를 요청하는 것을 나타내며, 이를 통해 API로부터 추가 데이터를 요청할 수 있습니다.

```
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
```
- useEffect구성 요소가 마운트될 때 창에 스크롤 이벤트 리스너가 추가됩니다. handleScroll사용자가 스크롤할 때 함수를 호출합니다 .

## Reference
- https://www.youtube.com/watch?v=ahpbfQybX94&t=72s
- https://www.youtube.com/watch?v=WIASshZpyCc&t=265s
- https://www.youtube.com/watch?v=JWlOcDus_rs

