import type { GalleryEntry } from '../../../types/gallery';

type Props = {
  hoveredObject: GalleryEntry | null;
  selectedObject: GalleryEntry | null;
  activePolyCount: number | null;
  objectsCount: number;
  xrSupported: boolean;
  onAddObject: () => void;
  onToggleVR: () => void;
};

export function GalleryPanel({
  hoveredObject,
  selectedObject,
  activePolyCount,
  objectsCount,
  xrSupported,
  onAddObject,
  onToggleVR,
}: Props) {
  return (
    <div className="ui">
      <div className="buttons">
        <button onClick={onAddObject}>Добавить объект</button>
        <button disabled={!xrSupported} onClick={onToggleVR}>
          {!xrSupported ? 'VR не поддерживается' : 'VR Mode'}
        </button>
      </div>
      <div className="panel">
        <div className="panel-title">Информация</div>
        <div>Подсвечен: {hoveredObject?.name ?? '—'}</div>
        <div>Выбран: {selectedObject?.name ?? '—'}</div>
        <div>
          Полигоны:{' '}
          {typeof activePolyCount === 'number' ?
            activePolyCount.toLocaleString()
          : '—'}
        </div>
        <div>Всего объектов: {objectsCount}</div>
        <div className="hint">
          VR: LT — захват, поворот контроллера — перемещение.
          <br />
          X — удалить.
        </div>
        <div className="hint">До VR: ЛКМ/касание + потяни — осмотр.</div>
      </div>
    </div>
  );
}
