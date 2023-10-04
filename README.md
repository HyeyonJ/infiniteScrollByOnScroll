<img width="100%" src="https://github.com/HyeyonJ/infiniteScrollByOnScroll/assets/113879120/6426b8cc-437a-4d9a-94d9-80dcfbdc58af.gif">

<div align="center">
<h2>무한 스크롤(Infinite Scroll) 구현</h2>
  채팅 프로젝트를 구현하면서, 무한 스크롤 기능에 대해서 공부한 기록입니다.
</div>

## 목차
  - [Infinite Scroll?](#Infinite-Scroll?)
  - [구현 방법 구분](#구현-방법-구분)
  - [Intersection Observer API](#Intersection-Observer-API)
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
  <img width="100%" src="https://github.com/HyeyonJ/infiniteScrollByOnScroll/assets/113879120/25ff902b-06be-45c2-8e81-b6377d886057.png">

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
    <div style={{ textAlign: "center" }}>
      <input type="text" value={query} onChange={handleSearch}></input>
      {books.map((book, index) => {
        if (books.length === index + 1) {
          return (
            <div ref={lastBookElementRef} key={book}>
              {book}
            </div>
          );
        } else {
          return <div key={book}>{book}</div>;
        }
      })}
      <div>{loading && "Loading..."}</div>
      <div>{error && "Error"}</div>
    </div>
  );
}
```
- input value 값에 변화가 있을 시 onChange 이벤트 핸들러는 handleSearch를 연결합니다.
- books 배열을 매핑하여 동적으로 도서 목록을 생성합니다. 마지막 도서 요소 books.length === index + 1인 경우 lastBookElementRef를 참조하도록 설정합니다.

```
  function handleSearch(e) {
    setQuery(e.target.value);
    setPageNumber(1);
  }
```
- 텍스트를 입력할 때 마다 해당 텍스트로 query 상태 변수를 업데이트 합니다. 사용자가 검색어를 임력할 때 마다 화면이 다시 렌더링되며, 입력된 검색어에 따라 검색 결과가 동적으로 업데이트 됩니다.

```
useEffect(() => {
    setLoading(true);
    setError(false);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://openlibrary.org/search.json?q=${query}&page=${pageNumber}`
        );
        if (res.ok) {
          const data = await res.json();
          console.log("여기", data);
          setBooks((prevBooks) => [
            ...new Set([...prevBooks, ...data.docs.map((b) => b.title)])
          ]);
          setHasMore(data.docs.length > 0);
        }
      } catch (error) {
        console.error("데이터를 가져오는 중 오류 발생:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    }, 3000);
    return () => clearInterval(timeout);
  }, [query, pageNumber]);
```
- setTimteout은 데이터를 불러오기 전에 3초 동안 로딩 상태를 유지한 다음 데이터를 불러오는 비동기 작업을 합니다. 이로 인해, 컴포넌트 언마운트, query, pageNumber 변경되는 등의 경우에 setTimeout이 더 이상 실행되지 않도록 보장합니다.
- hasMore는 현재 데이터를 불러온 페이지에서 가져온 도서 목록(data.docs)의 길이보다 0보다 큰지를 검사하는 조건식입니다.
- 만약 현재 페이지에서 가져온 도서 목록의 길이가 0보다 크다면, 즉, 데이터가 존재한다면 조건식은 true로 바뀌어 실행됩니다.

```
 const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );
```
- lastBookElementRef 변수는 IntersectionObserver를 사용하여 화면의 가장 하단에 도달하면 다음 페이지의 데이터를 불러오기 위한 콜백 함수입니다.
- entries[0].isIntersecting는 첫 번째 요소가 화면에 진입했는지 여부를 나타내는 불리언 값입니다.
- hasMore 상태가 true이면서 첫 번째 요소가 화면에 진입하면 다음 페이지를 요청하기 위해 setPageNumber 함수를 호출하여 페이지 번호를 업데이트합니다.
- 콜백 함수가 관찰할 DOM 요소(node)가 존재하면해당 요소를 감시하기 위해 observer.current.observe(node)를 호출합니다.

## Reference
- https://www.youtube.com/watch?v=NZKUirTtxcg&t=691s
- https://velog.io/@doondoony/IntersectionObserver
- https://y0c.github.io/2019/06/30/react-infinite-scroll/
- https://medium.com/suyeonme/react-how-to-implement-an-infinite-scroll-749003e9896a

