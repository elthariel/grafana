package folderimpl

import (
	"context"

	"github.com/grafana/grafana/pkg/infra/db"
	"github.com/grafana/grafana/pkg/infra/log"
	"github.com/grafana/grafana/pkg/services/featuremgmt"
	"github.com/grafana/grafana/pkg/services/folder"
	"github.com/grafana/grafana/pkg/setting"
)

type store struct {
	db  db.DB
	log log.Logger
	cfg *setting.Cfg
	fm  featuremgmt.FeatureManager
}

// store implements the folder.Store interface.
var _ folder.Store = (*store)(nil)

func ProvideStore(db db.DB, cfg *setting.Cfg, features featuremgmt.FeatureManager) *store {
	return &store{db: db, log: log.New("folder-store"), cfg: cfg, fm: features}
}

func (s *store) Create(ctx context.Context, cmd *folder.CreateFolderCommand) (*folder.Folder, error) {
	panic("not implemented")
	return nil, nil
}

func (s *store) Delete(ctx context.Context, uid string, orgID int64) error {
	panic("not implemented")
	return nil
}

func (s *store) Update(ctx context.Context, cmd *folder.UpdateFolderCommand) (*folder.Folder, error) {
	panic("not implemented")
	return nil, nil
}

func (s *store) Move(ctx context.Context, cmd *folder.MoveFolderCommand) (*folder.Folder, error) {
	panic("not implemented")
	return nil, nil
}

func (s *store) Get(ctx context.Context, cmd *folder.GetFolderCommand) (*folder.Folder, error) {
	panic("not implemented")
	return nil, nil
}

func (s *store) GetParent(ctx context.Context, uid string, orgID int64) (*folder.Folder, error) {
	panic("not implemented")
	return nil, nil
}

func (s *store) GetParents(ctx context.Context, uid string, orgID int64) ([]*folder.Folder, error) {
	panic("not implemented")
	return nil, nil
}

func (s *store) GetChildren(ctx context.Context, uid string, orgID, limit, page int64) ([]*folder.Folder, error) {
	panic("not implemented")
	return nil, nil
}

func (s *store) GetDescendents(ctx context.Context, uid string, orgID, limit, page int64) (map[string][]*folder.Folder, error) {
	panic("not implemented")
	return nil, nil
}
