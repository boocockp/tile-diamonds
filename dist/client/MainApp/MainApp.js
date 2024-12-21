const runtimeUrl = window.elementoRuntimeUrl || 'https://elemento.online/lib/runtime.js'
const Elemento = await import(runtimeUrl)
const {React, trace, elProps, stateProps, wrapFn} = Elemento

// MainPage.js
const MainPage_TileItemsItem = React.memo(function MainPage_TileItemsItem(props) {
    const pathTo = name => props.path + '.' + name
    const parentPathWith = name => Elemento.parentPath(props.path) + '.' + name
    const {$item, $itemId, $index, $selected, onClick} = props
    const {ItemSetItem, Block} = Elemento.components
    const _state = Elemento.useGetStore()
    const Cols = _state.useObject(parentPathWith('Cols'))
    const TileBlock = _state.setObject(pathTo('TileBlock'), new Block.State(stateProps(pathTo('TileBlock')).props))
    const TopTriangle = _state.setObject(pathTo('TopTriangle'), new Block.State(stateProps(pathTo('TopTriangle')).props))
    const RightTriangle = _state.setObject(pathTo('RightTriangle'), new Block.State(stateProps(pathTo('RightTriangle')).props))
    const BottomTriangle = _state.setObject(pathTo('BottomTriangle'), new Block.State(stateProps(pathTo('BottomTriangle')).props))
    const LeftTriangle = _state.setObject(pathTo('LeftTriangle'), new Block.State(stateProps(pathTo('LeftTriangle')).props))
    const SideColour2 = _state.setObject(pathTo('SideColour2'), React.useCallback(wrapFn(pathTo('SideColour2'), 'calculation', (tile, position) => {
        let colourIndex = (position + tile.rotation) % 4
        return tile.colours[colourIndex]
    }), []))
    const canDragItem = undefined
    const styles = elProps(pathTo('TileItems.Styles')).aspectRatio('1').width(100 / Cols + '%').border('1px solid blue').boxSizing('border-box').props

    return React.createElement(ItemSetItem, {path: props.path, item: $item, itemId: $itemId, index: $index, onClick, canDragItem, styles},
        React.createElement(Block, elProps(pathTo('TileBlock')).layout('positioned').styles(elProps(pathTo('TileBlock.Styles')).backgroundColor('lightgray').width('100%').height('100%').borderStyle('solid').borderLeftColor('green').boxSizing('border-box').maxHeight('100%').props).props,
            React.createElement(Block, elProps(pathTo('TopTriangle')).layout('positioned').styles(elProps(pathTo('TopTriangle.Styles')).backgroundColor(SideColour2($item, 0)).height('100%').width('100%').clipPath('polygon(2% 0, 50% 49%, 98% 0)').position('absolute').top('0').left('0').props).props),
            React.createElement(Block, elProps(pathTo('RightTriangle')).layout('positioned').styles(elProps(pathTo('RightTriangle.Styles')).backgroundColor(SideColour2($item, 1)).height('100%').width('100%').clipPath('polygon(100% 1%, 51% 50%, 100% 98%)').position('absolute').top('0').left('0').props).props),
            React.createElement(Block, elProps(pathTo('BottomTriangle')).layout('positioned').styles(elProps(pathTo('BottomTriangle.Styles')).backgroundColor(SideColour2($item, 2)).height('100%').width('100%').clipPath('polygon(1% 100%, 50% 51%, 98% 100%)').position('absolute').top('0').left('0').props).props),
            React.createElement(Block, elProps(pathTo('LeftTriangle')).layout('positioned').styles(elProps(pathTo('LeftTriangle.Styles')).backgroundColor(SideColour2($item, 3)).height('100%').width('100%').clipPath('polygon(0 2%, 49% 50%, 0 98%)').position('absolute').top('0').left('0').props).props),
    ),
    )
})


function MainPage(props) {
    const pathTo = name => props.path + '.' + name
    const {Page, Data, Calculation, Timer, TextElement, Dialog, Button, Block, ItemSet} = Elemento.components
    const {And, Not, Or, If, Log, Record, Count, FirstNotNull, ItemAt, Eq, ForEach, Range, RandomFrom, Random, List, Ceiling} = Elemento.globalFunctions
    const {Reset, Set, SetWithUpdates} = Elemento.appFunctions
    const _state = Elemento.useGetStore()
    const app = _state.useObject('MainApp')
    const {SendMessage, CurrentUrl, AppHeight} = app
    const Status = _state.setObject(pathTo('Status'), new Data.State(stateProps(pathTo('Status')).value('Ready').props))
    const Score = _state.setObject(pathTo('Score'), new Data.State(stateProps(pathTo('Score')).value(0).props))
    const RoundSkipped = _state.setObject(pathTo('RoundSkipped'), new Data.State(stateProps(pathTo('RoundSkipped')).value(false).props))
    const RoundScoreAdded = _state.setObject(pathTo('RoundScoreAdded'), new Data.State(stateProps(pathTo('RoundScoreAdded')).value(false).props))
    const GameRunning = _state.setObject(pathTo('GameRunning'), new Calculation.State(stateProps(pathTo('GameRunning')).value(Or(Status == 'Playing', Status == 'Paused')).props))
    const SendScore = _state.setObject(pathTo('SendScore'), React.useCallback(wrapFn(pathTo('SendScore'), 'calculation', async (score) => {
        Log('Send Score', score)
        await SendMessage('parent', Record('score', score, 'url', (await CurrentUrl()).text))
    }), []))
    const Rows = _state.setObject(pathTo('Rows'), new Calculation.State(stateProps(pathTo('Rows')).value(4).props))
    const Cols = _state.setObject(pathTo('Cols'), new Calculation.State(stateProps(pathTo('Cols')).value(4).props))
    const TileCount = _state.setObject(pathTo('TileCount'), new Calculation.State(stateProps(pathTo('TileCount')).value(Rows * Cols).props))
    const Colours = _state.setObject(pathTo('Colours'), new Calculation.State(stateProps(pathTo('Colours')).value(['blue', 'red', 'yellow', 'green']).props))
    const Tiles = _state.setObject(pathTo('Tiles'), new Data.State(stateProps(pathTo('Tiles')).props))
    const HorizontalSides = _state.setObject(pathTo('HorizontalSides'), new Data.State(stateProps(pathTo('HorizontalSides')).props))
    const VerticalSides = _state.setObject(pathTo('VerticalSides'), new Data.State(stateProps(pathTo('VerticalSides')).props))
    const SideColour = _state.setObject(pathTo('SideColour'), React.useCallback(wrapFn(pathTo('SideColour'), 'calculation', (tile, position) => {
        let colourIndex = (position + tile.rotation) % 4
        return tile.colours[colourIndex]
    }), []))
    const NextTile = _state.setObject(pathTo('NextTile'), React.useCallback(wrapFn(pathTo('NextTile'), 'calculation', (index, position) => {
        let rowPosition = index % Cols
        
        return FirstNotNull(
         If( position == 0, () => ItemAt(Tiles, index - Cols)),
         If( position == 1 && rowPosition < Cols - 1, () => ItemAt(Tiles, index + 1)),
         If( position == 2, () => ItemAt(Tiles, index + Cols)),
         If( position == 3 && rowPosition > 0, () => ItemAt(Tiles, index - 1))
        )
    }), [Cols, Tiles]))
    const TileMatchesSides = _state.setObject(pathTo('TileMatchesSides'), React.useCallback(wrapFn(pathTo('TileMatchesSides'), 'calculation', (tile, index) => {
        let top = 0, right = 1, bottom = 2, left = 3
        let topTile = NextTile(index, top)
        let rightTile = NextTile(index, right)
        let bottomTile = NextTile(index, bottom)
        let leftTile = NextTile(index, left)
        
        let topOk = topTile == null || SideColour(topTile, bottom) == SideColour(tile, top)
        let bottomOk = bottomTile == null || SideColour(bottomTile, top) == SideColour(tile, bottom)
        let leftOk = leftTile == null || SideColour(leftTile, right) == SideColour(tile, left)
        let rightOk = rightTile == null || SideColour(rightTile, left) == SideColour(tile, right)
        return And(topOk, bottomOk, leftOk, rightOk)
    }), [NextTile, SideColour]))
    const TileMatchCount = _state.setObject(pathTo('TileMatchCount'), new Calculation.State(stateProps(pathTo('TileMatchCount')).value(Count(Tiles, ($item, $index) => TileMatchesSides($item, $index))).props))
    const RoundCorrect = _state.setObject(pathTo('RoundCorrect'), React.useCallback(wrapFn(pathTo('RoundCorrect'), 'calculation', () => {
        return Eq(TileMatchCount, TileCount)
    }), [TileMatchCount, TileCount]))
    const IsRoundWon = _state.setObject(pathTo('IsRoundWon'), new Calculation.State(stateProps(pathTo('IsRoundWon')).value(And(GameRunning, Not(RoundSkipped), RoundCorrect())).props))
    const Points = _state.setObject(pathTo('Points'), React.useCallback(wrapFn(pathTo('Points'), 'calculation', (word) => {
        let bonus = If(IsRoundWon, 12, 0)
        let pointsPerTile = If(TileMatchCount >= TileCount / 2, 3, 0)
        return TileMatchCount * pointsPerTile + bonus
    }), [IsRoundWon, TileMatchCount, TileCount]))
    const RoundFailed = _state.setObject(pathTo('RoundFailed'), React.useCallback(wrapFn(pathTo('RoundFailed'), 'calculation', () => {
        return false
    }), []))
    const IsRoundFailed = _state.setObject(pathTo('IsRoundFailed'), new Calculation.State(stateProps(pathTo('IsRoundFailed')).value(And(GameRunning, Not(RoundSkipped), RoundFailed())).props))
    const IsRoundComplete = _state.setObject(pathTo('IsRoundComplete'), new Calculation.State(stateProps(pathTo('IsRoundComplete')).value(Or(IsRoundWon, IsRoundFailed, RoundSkipped, Not(GameRunning))).props))
    const RoundInPlay = _state.setObject(pathTo('RoundInPlay'), new Calculation.State(stateProps(pathTo('RoundInPlay')).value(Not(IsRoundComplete)).props))
    const RoundScoresPoints = _state.setObject(pathTo('RoundScoresPoints'), React.useCallback(wrapFn(pathTo('RoundScoresPoints'), 'calculation', () => {
        return true
    }), []))
    const AddRoundScore = _state.setObject(pathTo('AddRoundScore'), React.useCallback(wrapFn(pathTo('AddRoundScore'), 'calculation', async () => {
        let needToAddScore = And(Not(RoundScoreAdded), RoundScoresPoints())
        await If(needToAddScore, () => Set(Score, Score + Points()))
        Set(RoundScoreAdded, true)
    }), [RoundScoreAdded, RoundScoresPoints, Score, Points]))
    const EndGame = _state.setObject(pathTo('EndGame'), React.useCallback(wrapFn(pathTo('EndGame'), 'calculation', async () => {
        await AddRoundScore()
        await SendScore(Score)
        Set(Status, 'Ended')
    }), [AddRoundScore, SendScore, Score, Status]))
    const GameTimer_endAction = React.useCallback(wrapFn(pathTo('GameTimer'), 'endAction', async ($timer) => {
        await EndGame()
    }), [EndGame])
    const GameTimer = _state.setObject(pathTo('GameTimer'), new Timer.State(stateProps(pathTo('GameTimer')).period(180).interval(1).endAction(GameTimer_endAction).props))
    const PauseGame = _state.setObject(pathTo('PauseGame'), React.useCallback(wrapFn(pathTo('PauseGame'), 'calculation', async () => {
        Set(Status, 'Paused')
        await GameTimer.Stop()
    }), [Status, GameTimer]))
    const ContinueGame = _state.setObject(pathTo('ContinueGame'), React.useCallback(wrapFn(pathTo('ContinueGame'), 'calculation', async () => {
        Set(Status, 'Playing')
        await GameTimer.Start()
    }), [Status, GameTimer]))
    const StopGame = _state.setObject(pathTo('StopGame'), React.useCallback(wrapFn(pathTo('StopGame'), 'calculation', async () => {
        await GameTimer.Stop()
        await EndGame()
    }), [GameTimer, EndGame]))
    const SetupNewRound = _state.setObject(pathTo('SetupNewRound'), React.useCallback(wrapFn(pathTo('SetupNewRound'), 'calculation', () => {
        let horizSideCount = Cols * (Rows + 1)
        let vertSideCount = Rows * (Cols + 1)
        let horizontalSides = ForEach(Range(0, horizSideCount - 1), ($item, $index) => RandomFrom(Colours))
        let verticalSides = ForEach(Range(0, vertSideCount - 1), ($item, $index) => RandomFrom(Colours))
        Set(Tiles, ForEach(Range(0, TileCount - 1), ($item, $index) => Record('rotation', Random(3), 'colours', List(
         horizontalSides[$index],
         verticalSides[$index + 1],
         horizontalSides[$index + Cols],
         verticalSides[$index]
        ))))
    }), [Cols, Rows, Colours, Tiles, TileCount]))
    const StartNewRound = _state.setObject(pathTo('StartNewRound'), React.useCallback(wrapFn(pathTo('StartNewRound'), 'calculation', async () => {
        Reset(RoundSkipped, RoundScoreAdded)
        await SetupNewRound()
    }), [RoundSkipped, RoundScoreAdded, SetupNewRound]))
    const StartNewGame = _state.setObject(pathTo('StartNewGame'), React.useCallback(wrapFn(pathTo('StartNewGame'), 'calculation', async () => {
        Reset(Score)
        Reset(GameTimer)
        Set(Status, 'Playing')
        await StartNewRound()
        await GameTimer.Start()
    }), [Score, GameTimer, Status, StartNewRound]))
    const FinishRound = _state.setObject(pathTo('FinishRound'), React.useCallback(wrapFn(pathTo('FinishRound'), 'calculation', () => {}), []))
    const EndRound = _state.setObject(pathTo('EndRound'), React.useCallback(wrapFn(pathTo('EndRound'), 'calculation', async () => {
        await AddRoundScore()
        await FinishRound()
    }), [AddRoundScore, FinishRound]))
    const WhenRoundComplete_whenTrueAction = React.useCallback(wrapFn(pathTo('WhenRoundComplete'), 'whenTrueAction', async () => {
        await EndRound()
    }), [EndRound])
    const WhenRoundComplete = _state.setObject(pathTo('WhenRoundComplete'), new Calculation.State(stateProps(pathTo('WhenRoundComplete')).value(IsRoundComplete).whenTrueAction(WhenRoundComplete_whenTrueAction).props))
    const RotateTile = _state.setObject(pathTo('RotateTile'), React.useCallback(wrapFn(pathTo('RotateTile'), 'calculation', async (tileIndex) => {
        let tile = ItemAt(Tiles, tileIndex)
        let newRotation = await If(tile.rotation == 0, 3, () => tile.rotation - 1)
        await SetWithUpdates(Tiles, tileIndex, {rotation: newRotation, colours: tile.colours})
    }), [Tiles]))
    const Instructions = _state.setObject(pathTo('Instructions'), new Dialog.State(stateProps(pathTo('Instructions')).initiallyOpen(false).props))
    const StatsLayout = _state.setObject(pathTo('StatsLayout'), new Block.State(stateProps(pathTo('StatsLayout')).props))
    const ReadyPanel = _state.setObject(pathTo('ReadyPanel'), new Block.State(stateProps(pathTo('ReadyPanel')).props))
    const PausePanel = _state.setObject(pathTo('PausePanel'), new Block.State(stateProps(pathTo('PausePanel')).props))
    const PlayPanel = _state.setObject(pathTo('PlayPanel'), new Block.State(stateProps(pathTo('PlayPanel')).props))
    const TileGrid = _state.setObject(pathTo('TileGrid'), new Block.State(stateProps(pathTo('TileGrid')).props))
    const TileItems_selectAction = React.useCallback(wrapFn(pathTo('TileItems'), 'selectAction', async ($item, $itemId, $index) => {
        await If(RoundInPlay, async () => await RotateTile($itemId))
    }), [RoundInPlay, RotateTile])
    const TileItems = _state.setObject(pathTo('TileItems'), new ItemSet.State(stateProps(pathTo('TileItems')).items(Tiles).selectable('single').selectAction(TileItems_selectAction).props))
    const EndofGamePanel = _state.setObject(pathTo('EndofGamePanel'), new Block.State(stateProps(pathTo('EndofGamePanel')).props))
    const ControlsLayout = _state.setObject(pathTo('ControlsLayout'), new Block.State(stateProps(pathTo('ControlsLayout')).props))
    const StartGame2_action = React.useCallback(wrapFn(pathTo('StartGame2'), 'action', async () => {
        await StartNewGame()
        await Instructions.Close()
    }), [StartNewGame, Instructions])
    const NewTiles_action = React.useCallback(wrapFn(pathTo('NewTiles'), 'action', async () => {
        await StartNewRound()
    }), [StartNewRound])
    const SkipTiles_action = React.useCallback(wrapFn(pathTo('SkipTiles'), 'action', () => {
        Set(RoundSkipped, true)
    }), [RoundSkipped])
    const StartGame_action = React.useCallback(wrapFn(pathTo('StartGame'), 'action', async () => {
        await StartNewGame()
    }), [StartNewGame])
    const StopGame_action = React.useCallback(wrapFn(pathTo('StopGame'), 'action', async () => {
        await StopGame()
    }), [StopGame])
    const Pause_action = React.useCallback(wrapFn(pathTo('Pause'), 'action', async () => {
        await PauseGame()
    }), [PauseGame])
    const Continue_action = React.useCallback(wrapFn(pathTo('Continue'), 'action', async () => {
        await ContinueGame()
    }), [ContinueGame])
    const Help_action = React.useCallback(wrapFn(pathTo('Help'), 'action', async () => {
        await Instructions.Show()
    }), [Instructions])
    Elemento.elementoDebug(() => eval(Elemento.useDebugExpr()))

    return React.createElement(Page, elProps(props.path).styles(elProps(pathTo('MainPage.Styles')).gap('4px').props).props,
        React.createElement(Data, elProps(pathTo('Status')).display(false).props),
        React.createElement(Data, elProps(pathTo('Score')).display(false).props),
        React.createElement(Data, elProps(pathTo('RoundSkipped')).display(false).props),
        React.createElement(Calculation, elProps(pathTo('IsRoundWon')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('IsRoundFailed')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('WhenRoundComplete')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('IsRoundComplete')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('RoundInPlay')).show(false).props),
        React.createElement(Data, elProps(pathTo('RoundScoreAdded')).display(false).props),
        React.createElement(Calculation, elProps(pathTo('GameRunning')).show(false).props),
        React.createElement(Timer, elProps(pathTo('GameTimer')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('Rows')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('Cols')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('TileCount')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('Colours')).show(false).props),
        React.createElement(Calculation, elProps(pathTo('TileMatchCount')).show(false).props),
        React.createElement(Data, elProps(pathTo('Tiles')).display(false).props),
        React.createElement(Data, elProps(pathTo('HorizontalSides')).display(false).props),
        React.createElement(Data, elProps(pathTo('VerticalSides')).display(false).props),
        React.createElement(TextElement, elProps(pathTo('Title')).styles(elProps(pathTo('Title.Styles')).fontFamily('fantasy').color('#039a03').fontSize(If (AppHeight() < 550, '20px', '32px')).height(If (AppHeight() < 550, '22px')).props).content('Tile Diamonds').props),
        React.createElement(Dialog, elProps(pathTo('Instructions')).layout('vertical').showCloseButton(true).styles(elProps(pathTo('Instructions.Styles')).padding('2em').props).props,
            React.createElement(TextElement, elProps(pathTo('InstructionsText')).allowHtml(true).content(`Rotate all the tiles (by clicking on them) so that the colours match at each side, and form a diamond across each tile edge.


Once you have a certain number of tiles matching all their neighbours, you earn points for each tile.


If you get all the tiles to match, you earn a bonus, and you can have another turn with new tiles.  Or if you get stuck, you can keep the points you have and start a new set of tiles.


Click New Tiles to start a new set. 


<b>Tips</b>
<ul>
<li>A pair of tiles with only one colour in common must match on that side</li>
</ul>

You have 3 minutes to complete as many sets as you can.`).props),
            React.createElement(Button, elProps(pathTo('StartGame2')).content('Start Game').appearance('filled').show(Not(GameRunning)).action(StartGame2_action).props),
    ),
        React.createElement(Block, elProps(pathTo('StatsLayout')).layout('horizontal').styles(elProps(pathTo('StatsLayout.Styles')).fontSize('24').justifyContent('space-between').width('100%').props).props,
            React.createElement(TextElement, elProps(pathTo('ScoreDisplay')).show(Or(GameRunning, Status == 'Ended')).styles(elProps(pathTo('ScoreDisplay.Styles')).fontSize('inherit').color('blue').props).content(Score + ' points').props),
            React.createElement(TextElement, elProps(pathTo('TimeDisplay')).show(GameRunning).styles(elProps(pathTo('TimeDisplay.Styles')).fontSize('inherit').color('green').props).content(Ceiling(GameTimer. remainingTime) + 's left').props),
            React.createElement(TextElement, elProps(pathTo('GameOver')).show(Status == 'Ended').styles(elProps(pathTo('GameOver.Styles')).fontSize('inherit').color('white').backgroundColor('green').padding('0 0.5em').borderRadius('8px').props).content('Game Over').props),
    ),
        React.createElement(Block, elProps(pathTo('ReadyPanel')).layout('vertical').show(Status == 'Ready').props,
            React.createElement(TextElement, elProps(pathTo('Title')).styles(elProps(pathTo('Title.Styles')).color('#039a03').fontFamily('fantasy').fontSize('28').props).content('Welcome!').props),
            React.createElement(TextElement, elProps(pathTo('ReadyText')).styles(elProps(pathTo('ReadyText.Styles')).fontSize('20').props).content(`Click the tiles to rotate them so that the colours match at every side.

Click Help for full details

Or Start to dive right in!`).props),
    ),
        React.createElement(Block, elProps(pathTo('PausePanel')).layout('vertical').show(Status == 'Paused').props,
            React.createElement(TextElement, elProps(pathTo('Title')).styles(elProps(pathTo('Title.Styles')).color('#7529df').fontFamily('Luckiest Guy').fontSize('28').props).content('Paused...').props),
            React.createElement(TextElement, elProps(pathTo('PauseText')).styles(elProps(pathTo('PauseText.Styles')).fontSize('20').props).content('Click Continue to carry on').props),
    ),
        React.createElement(Block, elProps(pathTo('PlayPanel')).layout('vertical').show(Or(Status == 'Playing', Status == 'Ended')).styles(elProps(pathTo('PlayPanel.Styles')).width('100%').position('relative').padding('0').margin('0').gap('4px').props).props,
            React.createElement(Block, elProps(pathTo('TileGrid')).layout('horizontal wrapped').styles(elProps(pathTo('TileGrid.Styles')).width('100%').aspectRatio(Cols/Rows).maxWidth('500').border('1px solid gray').gap('0').props).props,
            React.createElement(ItemSet, elProps(pathTo('TileItems')).itemContentComponent(MainPage_TileItemsItem).props),
    ),
            React.createElement(Block, elProps(pathTo('EndofGamePanel')).layout('vertical').show(Status == 'Ended').styles(elProps(pathTo('EndofGamePanel.Styles')).position('absolute').top('50%').left('50%').translate('-50% -50%').backgroundColor('white').borderRadius('10').border('2px solid green').minWidth('18em').padding('1em').zIndex(1).props).props,
            React.createElement(TextElement, elProps(pathTo('Title')).styles(elProps(pathTo('Title.Styles')).fontFamily('fantasy, Arial').fontSize('28').color('#039a03').props).content('Congratulations!').props),
            React.createElement(TextElement, elProps(pathTo('Score')).content('You have scored ' + Score + ' points!').props),
            React.createElement(TextElement, elProps(pathTo('Whatnext')).content('Click Start to have another go').props),
    ),
            React.createElement(TextElement, elProps(pathTo('RoundInProgress')).show(RoundInPlay).content(Points() + ' points for these tiles so far').props),
            React.createElement(TextElement, elProps(pathTo('RoundWon')).allowHtml(true).show(IsRoundWon).styles(elProps(pathTo('RoundWon.Styles')).props).content('All Correct &nbsp &mdash; &nbsp ' + Points() + ' points added!').props),
            React.createElement(TextElement, elProps(pathTo('RoundSkipped')).show(RoundSkipped).content('Skipped - ' + Points() + ' points for these tiles').props),
    ),
        React.createElement(Block, elProps(pathTo('ControlsLayout')).layout('horizontal').props,
            React.createElement(Button, elProps(pathTo('NewTiles')).content('New Tiles').appearance('filled').show(And(GameRunning, IsRoundComplete)).action(NewTiles_action).styles(elProps(pathTo('NewTiles.Styles')).marginRight('20px').props).props),
            React.createElement(Button, elProps(pathTo('SkipTiles')).content('Skip Tiles').appearance('outline').show(RoundInPlay).action(SkipTiles_action).styles(elProps(pathTo('SkipTiles.Styles')).marginRight('20px').props).props),
            React.createElement(Button, elProps(pathTo('StartGame')).content('Start').appearance('filled').show(Not(GameRunning)).action(StartGame_action).props),
            React.createElement(Button, elProps(pathTo('StopGame')).content('Stop').appearance('outline').show(GameRunning).action(StopGame_action).props),
            React.createElement(Button, elProps(pathTo('Pause')).content('Pause').appearance('outline').show(Status == 'Playing').action(Pause_action).props),
            React.createElement(Button, elProps(pathTo('Continue')).content('Continue').appearance('outline').show(Status == 'Paused').action(Continue_action).props),
            React.createElement(Button, elProps(pathTo('Help')).content('Help').appearance('outline').action(Help_action).props),
    ),
    )
}

// appMain.js
export default function MainApp(props) {
    const pathTo = name => 'MainApp' + '.' + name
    const {App} = Elemento.components
    const pages = {MainPage}
    const appContext = Elemento.useGetAppContext()
    const _state = Elemento.useGetStore()
    const app = _state.setObject('MainApp', new App.State({pages, appContext}))

    return React.createElement(App, {...elProps('MainApp').maxWidth('500px').props},)
}
